import { TRPCError, TRPCRouterRecord } from "@trpc/server";
import { desc, eq } from "drizzle-orm";
import { z } from "zod/v4";

import {
  Article,
  CreateArticleSchema,
  UpdateArticleSchema,
} from "~/lib/server/schema";
import { deleteFile, uploadImage } from "~/lib/utils";
import { protectedProcedure, publicProcedure } from "~/trpc/init";

export const blogRouter = {
  all: protectedProcedure.query(({ ctx }) => {
    return ctx.db.query.Article.findMany({
      orderBy: desc(Article.id),
    });
  }),

  allPublic: publicProcedure.query(({ ctx }) => {
    return ctx.db.query.Article.findMany({
      orderBy: desc(Article.createdAt),
      where: eq(Article.isDraft, false),
    });
  }),

  bySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ ctx, input }) => {
      const article = await ctx.db.query.Article.findFirst({
        where: eq(Article.slug, input.slug),
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
      return ctx.db.query.Article.findFirst({
        where: eq(Article.id, input.id),
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

      return ctx.db.insert(Article).values(articleData);
    }),

  update: protectedProcedure
    .input(UpdateArticleSchema)
    .mutation(async ({ ctx, input }) => {
      const { thumbnail, id, ...articleData } = input;

      if (thumbnail) {
        try {
          const existingArticle = await ctx.db.query.Article.findFirst({
            where: eq(Article.id, id),
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

      return ctx.db.update(Article).set(articleData).where(eq(Article.id, id));
    }),

  delete: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      const articleToDelete = await ctx.db.query.Article.findFirst({
        where: eq(Article.id, input),
      });

      if (articleToDelete?.imageUrl) {
        await deleteFile(articleToDelete.imageUrl);
      }

      return ctx.db.delete(Article).where(eq(Article.id, input));
    }),
} satisfies TRPCRouterRecord;
