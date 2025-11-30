import {
  CreateSnippetSchema,
  Snippet,
  UpdateSnippetSchema,
} from "@acme/db/schema";
import { TRPCError, TRPCRouterRecord } from "@trpc/server";
import { desc, eq } from "drizzle-orm";
import { z } from "zod/v4";
import { protectedProcedure, publicProcedure } from "../trpc";

export const snippetRouter = {
  all: protectedProcedure.query(({ ctx }) =>
    ctx.db.query.Snippet.findMany({
      orderBy: desc(Snippet.id),
    })
  ),

  allPublic: publicProcedure.query(({ ctx }) =>
    ctx.db.query.Snippet.findMany({
      orderBy: desc(Snippet.id),
      where: eq(Snippet.isDraft, false),
    })
  ),

  byId: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) =>
      ctx.db.query.Snippet.findFirst({
        where: eq(Snippet.id, input.id),
      })
    ),

  bySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ ctx, input }) => {
      const snippet = await ctx.db.query.Snippet.findFirst({
        where: eq(Snippet.slug, input.slug),
      });

      if (!snippet) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Snippet not found",
        });
      }

      // if project is draft, throw an error unless user is admin
      if (snippet.isDraft && ctx.session?.user.role !== "admin") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Snippet is not public",
        });
      }

      return snippet;
    }),

  create: protectedProcedure
    .input(CreateSnippetSchema)
    .mutation(({ ctx, input }) => ctx.db.insert(Snippet).values(input)),

  update: protectedProcedure
    .input(UpdateSnippetSchema)
    .mutation(({ ctx, input }) =>
      ctx.db.update(Snippet).set(input).where(eq(Snippet.id, input.id))
    ),

  delete: protectedProcedure
    .input(z.string())
    .mutation(({ ctx, input }) =>
      ctx.db.delete(Snippet).where(eq(Snippet.id, input))
    ),
} satisfies TRPCRouterRecord;
