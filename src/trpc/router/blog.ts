import { TRPCError, TRPCRouterRecord } from "@trpc/server";
import { desc, eq } from "drizzle-orm";
import { z } from "zod/v4";

import {
  CreateArticleSchema,
  UpdateArticleSchema,
  articles,
} from "~/lib/server/schema";
import { deleteFile, uploadImage } from "~/lib/utils";
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

      return article;
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
          articleData.imageUrl = await uploadImage(
            "articles",
            thumbnail,
            input.slug,
          );
        } catch (error) {
          console.error("Error uploading image:", error);
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

          articleData.imageUrl = await uploadImage(
            "articles",
            thumbnail,
            input.slug ?? id,
          );

          if (oldImageUrl) {
            await deleteFile(oldImageUrl);
          }
        } catch (error) {
          console.error("Error uploading image:", error);
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

  like: protectedProcedure
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

      return ctx.db
        .update(articles)
        .set({
          likes: article.likes + 1,
        })
        .where(eq(articles.slug, input.slug));
    }),
} satisfies TRPCRouterRecord;
