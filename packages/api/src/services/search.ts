import type { db as DB } from "@acme/db/client";
import { articles, Project, Snippet } from "@acme/db/schema";
import { and, eq, ilike, or } from "drizzle-orm";

type DbClient = typeof DB;

function escapeSearchTerm(term: string): string {
  return term.replace(/[%_\\]/g, "\\$&");
}

export async function query(db: DbClient, input: { query: string }) {
  const searchTerm = `%${escapeSearchTerm(input.query)}%`;

  const [articlesResult, projectsResult, snippetsResult] = await Promise.all([
    db.query.articles.findMany({
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
    db.query.Project.findMany({
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
    db.query.Snippet.findMany({
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
}
