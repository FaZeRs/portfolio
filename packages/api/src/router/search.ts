import { articles, Project, Snippet } from "@acme/db/schema";
import type { TRPCRouterRecord } from "@trpc/server";
import { and, eq, ilike, or } from "drizzle-orm";
import { z } from "zod/v4";
import { publicProcedure } from "../trpc";

function escapeSearchTerm(term: string): string {
  return term.replace(/[%_\\]/g, "\\$&");
}

export const searchRouter = {
  query: publicProcedure
    .input(z.object({ query: z.string().min(1).max(100) }))
    .query(async ({ ctx, input }) => {
      const searchTerm = `%${escapeSearchTerm(input.query)}%`;

      const [articlesResult, projectsResult, snippetsResult] =
        await Promise.all([
          ctx.db.query.articles.findMany({
            where: and(
              eq(articles.isDraft, false),
              or(
                ilike(articles.title, searchTerm),
                ilike(articles.description, searchTerm)
              )
            ),
            columns: {
              id: true,
              title: true,
              slug: true,
              description: true,
            },
            limit: 5,
          }),
          ctx.db.query.Project.findMany({
            where: and(
              eq(Project.isDraft, false),
              or(
                ilike(Project.title, searchTerm),
                ilike(Project.description, searchTerm)
              )
            ),
            columns: {
              id: true,
              title: true,
              slug: true,
              description: true,
            },
            limit: 5,
          }),
          ctx.db.query.Snippet.findMany({
            where: and(
              eq(Snippet.isDraft, false),
              or(
                ilike(Snippet.title, searchTerm),
                ilike(Snippet.description, searchTerm)
              )
            ),
            columns: {
              id: true,
              title: true,
              slug: true,
              description: true,
            },
            limit: 5,
          }),
        ]);

      return {
        articles: articlesResult,
        projects: projectsResult,
        snippets: snippetsResult,
      };
    }),
} satisfies TRPCRouterRecord;
