import type { db as DB } from "@acme/db/client";
import {
  CreateSnippetSchema,
  Snippet,
  UpdateSnippetSchema,
} from "@acme/db/schema";
import { desc, eq } from "drizzle-orm";
import type { z } from "zod/v4";

type DbClient = typeof DB;

export function getAll(db: DbClient) {
  return db.query.Snippet.findMany({
    orderBy: desc(Snippet.id),
  });
}

export function getAllPublic(db: DbClient) {
  return db.query.Snippet.findMany({
    orderBy: desc(Snippet.id),
    where: eq(Snippet.isDraft, false),
  });
}

export function getById(db: DbClient, input: { id: string }) {
  return db.query.Snippet.findFirst({
    where: eq(Snippet.id, input.id),
  });
}

export async function getBySlug(
  db: DbClient,
  input: { slug: string },
  session?: { user: { role: string } } | null
) {
  const snippet = await db.query.Snippet.findFirst({
    where: eq(Snippet.slug, input.slug),
  });

  if (!snippet) {
    throw new Error("Snippet not found");
  }

  // if snippet is draft, throw an error unless user is admin
  if (snippet.isDraft && session?.user.role !== "admin") {
    throw new Error("Snippet is not public");
  }

  return snippet;
}

export function create(
  db: DbClient,
  input: z.infer<typeof CreateSnippetSchema>
) {
  return db.insert(Snippet).values(input);
}

export function update(
  db: DbClient,
  input: z.infer<typeof UpdateSnippetSchema>
) {
  return db.update(Snippet).set(input).where(eq(Snippet.id, input.id));
}

export function remove(db: DbClient, id: string) {
  return db.delete(Snippet).where(eq(Snippet.id, id));
}
