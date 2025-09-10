import { createHash } from "node:crypto";
import { TRPCError, TRPCRouterRecord } from "@trpc/server";
import { desc, eq, sql } from "drizzle-orm";
import { z } from "zod/v4";

import { env } from "~/lib/env.server";
import { deleteFile, uploadImage } from "~/lib/s3";
import {
  articleLikes,
  articles,
  CreateArticleSchema,
  UpdateArticleSchema,
} from "~/lib/server/schema";
import { getTOC } from "~/lib/utils";
import { protectedProcedure, publicProcedure } from "~/trpc/init";

export const blogRouter = {
  all: protectedProcedure.query(({ ctx }) => {
    return ctx.db.query.articles.findMany({
      orderBy: desc(articles.id),
    });
  }),

  allPublic: publicProcedure.query(({ ctx }) => {
    return ctx.db.query.articles.findMany({
      orderBy: desc(articles.createdAt),
      where: eq(articles.isDraft, false),
    });
  }),

  bySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ ctx, input }) => {
      const article = await ctx.db.query.articles.findFirst({
        where: eq(articles.slug, input.slug),
        with: {
          comments: true,
          author: true,
        },
      });

      if (!article) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Article not found",
        });
      }

      // if project is draft, throw an error unless user is admin
      if (article.isDraft && ctx.session?.user.role !== "ADMIN") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Article is not public",
        });
      }

      const toc = await getTOC(article.content ?? "");

      return { ...article, toc };
    }),

  byId: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.db.query.articles.findFirst({
        where: eq(articles.id, input.id),
      });
    }),

  create: protectedProcedure
    .input(CreateArticleSchema)
    .mutation(async ({ ctx, input }) => {
      const { thumbnail, ...articleData } = input;

      if (thumbnail) {
        try {
          const imageUrl = await uploadImage("articles", thumbnail, input.slug);
          articleData.imageUrl = imageUrl;
        } catch (error) {
          // biome-ignore lint/suspicious/noConsole: log error
          console.error(error);
        }
      }

      return ctx.db.insert(articles).values(articleData);
    }),

  update: protectedProcedure
    .input(UpdateArticleSchema)
    .mutation(async ({ ctx, input }) => {
      const { thumbnail, id, ...articleData } = input;

      if (thumbnail) {
        try {
          const existingArticle = await ctx.db.query.articles.findFirst({
            where: eq(articles.id, id),
          });
          const oldImageUrl = existingArticle?.imageUrl;

          const imageUrl = await uploadImage(
            "articles",
            thumbnail,
            input.slug ?? id
          );
          articleData.imageUrl = imageUrl;

          if (oldImageUrl) {
            await deleteFile(oldImageUrl);
          }
        } catch (error) {
          // biome-ignore lint/suspicious/noConsole: log error
          console.error(error);
        }
      }

      return ctx.db
        .update(articles)
        .set(articleData)
        .where(eq(articles.id, id));
    }),

  delete: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      const articleToDelete = await ctx.db.query.articles.findFirst({
        where: eq(articles.id, input),
      });

      if (articleToDelete?.imageUrl) {
        await deleteFile(articleToDelete.imageUrl);
      }

      return ctx.db.delete(articles).where(eq(articles.id, input));
    }),

  like: publicProcedure
    .input(z.object({ slug: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const article = await ctx.db.query.articles.findFirst({
        where: eq(articles.slug, input.slug),
      });

      if (!article) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Article not found",
        });
      }

      // if article is draft, throw an error unless user is admin
      if (article.isDraft && ctx.session?.user.role !== "ADMIN") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Article is not public",
        });
      }

      // Extract IP address from headers
      const ipAddress =
        ctx.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
        ctx.headers.get("x-real-ip") ||
        ctx.headers.get("cf-connecting-ip") ||
        // Fallback for localhost or non Vercel deployments
        "0.0.0.0";

      const currentUserId =
        // Since a users IP address is part of the sessionId in our database, we
        // hash it to protect their privacy. By combining it with a salt, we get
        // get a unique id we can refer to, but we won't know what their ip
        // address was.
        createHash("sha512")
          .update(ipAddress + (env.IP_ADDRESS_SALT || "fallback-salt"), "utf8")
          .digest("hex");

      const sessionId = `${input.slug}_${currentUserId}`;

      const existingLike = await ctx.db.query.articleLikes.findFirst({
        where: eq(articleLikes.id, sessionId),
      });

      // if like exists, delete it and decrement the likes count
      if (existingLike) {
        await ctx.db.delete(articleLikes).where(eq(articleLikes.id, sessionId));
        return ctx.db
          .update(articles)
          .set({
            likes: sql`${articles.likes} - 1`,
          })
          .where(eq(articles.slug, input.slug));
      }

      // if like does not exist, increment the likes count
      await ctx.db.insert(articleLikes).values({
        id: sessionId,
      });

      return ctx.db
        .update(articles)
        .set({
          likes: sql`${articles.likes} + 1`,
        })
        .where(eq(articles.slug, input.slug));
    }),

  isLiked: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ ctx, input }) => {
      // Extract IP address from headers (same logic as in like mutation)
      const ipAddress =
        ctx.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
        ctx.headers.get("x-real-ip") ||
        ctx.headers.get("cf-connecting-ip") ||
        "0.0.0.0";

      const currentUserId = createHash("sha512")
        .update(ipAddress + (env.IP_ADDRESS_SALT || "fallback-salt"), "utf8")
        .digest("hex");

      const sessionId = `${input.slug}_${currentUserId}`;

      const existingLike = await ctx.db.query.articleLikes.findFirst({
        where: eq(articleLikes.id, sessionId),
      });

      return Boolean(existingLike);
    }),

  view: publicProcedure
    .input(z.object({ slug: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const article = await ctx.db.query.articles.findFirst({
        where: eq(articles.slug, input.slug),
      });

      if (!article) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Article not found",
        });
      }

      // if article is draft, throw an error unless user is admin
      if (article.isDraft) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Article is not public",
        });
      }

      return ctx.db
        .update(articles)
        .set({
          views: article.views + 1,
        })
        .where(eq(articles.slug, input.slug));
    }),
} satisfies TRPCRouterRecord;
