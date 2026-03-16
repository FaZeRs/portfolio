import { createHash } from "node:crypto";
import type { db as DB } from "@acme/db/client";
import {
  articleLikes,
  articles,
  articleViews,
  type CreateArticleSchema,
  type UpdateArticleSchema,
} from "@acme/db/schema";
import { getTOC } from "@acme/utils";
import { desc, eq, sql } from "drizzle-orm";
import type { z } from "zod/v4";
import { env } from "../../env";
import { deleteFile, uploadImage } from "../s3";

type DbClient = typeof DB;

export function getAll(db: DbClient) {
  return db.query.articles.findMany({
    orderBy: desc(articles.id),
  });
}

export async function getAllPublic(db: DbClient) {
  const result = await db
    .select({
      id: articles.id,
      title: articles.title,
      slug: articles.slug,
      description: articles.description,
      imageUrl: articles.imageUrl,
      createdAt: articles.createdAt,
      updatedAt: articles.updatedAt,
      isDraft: articles.isDraft,
      likes: articles.likes,
      authorId: articles.authorId,
      content: articles.content,
      tags: articles.tags,
      viewCount: sql<number>`count(${articleViews.id})`.as("view_count"),
    })
    .from(articles)
    .leftJoin(articleViews, eq(articles.id, articleViews.articleId))
    .where(eq(articles.isDraft, false))
    .groupBy(articles.id)
    .orderBy(desc(articles.createdAt));

  return result;
}

export async function getBySlug(
  db: DbClient,
  input: { slug: string },
  session?: { user: { role: string } } | null
) {
  const article = await db.query.articles.findFirst({
    where: eq(articles.slug, input.slug),
    with: {
      comments: true,
      author: true,
    },
  });

  if (!article) {
    throw new Error("Article not found");
  }

  // if article is draft, throw an error unless user is admin
  if (article.isDraft && session?.user.role !== "admin") {
    throw new Error("Article is not public");
  }

  // Get view count separately
  const viewCount = await db
    .select({ count: sql<number>`count(*)` })
    .from(articleViews)
    .where(eq(articleViews.articleId, article.id));

  const toc = await getTOC(article.content ?? "");

  return { ...article, toc, viewCount: viewCount[0]?.count ?? 0 };
}

export function getById(db: DbClient, input: { id: string }) {
  return db.query.articles.findFirst({
    where: eq(articles.id, input.id),
  });
}

export async function create(
  db: DbClient,
  input: z.infer<typeof CreateArticleSchema>
) {
  const { thumbnail, ...articleData } = input;

  if (thumbnail) {
    try {
      const imageUrl = await uploadImage("articles", thumbnail, input.slug);
      articleData.imageUrl = imageUrl;
    } catch (error) {
      console.error(error);
    }
  }

  return db.insert(articles).values(articleData);
}

export async function update(
  db: DbClient,
  input: z.infer<typeof UpdateArticleSchema>
) {
  const { thumbnail, id, ...articleData } = input;

  if (thumbnail) {
    try {
      const existingArticle = await db.query.articles.findFirst({
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
      console.error(error);
    }
  }

  return db.update(articles).set(articleData).where(eq(articles.id, id));
}

export async function remove(db: DbClient, id: string) {
  const articleToDelete = await db.query.articles.findFirst({
    where: eq(articles.id, id),
  });

  if (articleToDelete?.imageUrl) {
    await deleteFile(articleToDelete.imageUrl);
  }

  return db.delete(articles).where(eq(articles.id, id));
}

export async function like(
  db: DbClient,
  input: { slug: string },
  headers: Headers,
  session?: { user: { role: string } } | null
) {
  const article = await db.query.articles.findFirst({
    where: eq(articles.slug, input.slug),
  });

  if (!article) {
    throw new Error("Article not found");
  }

  // if article is draft, throw an error unless user is admin
  if (article.isDraft && session?.user.role !== "admin") {
    throw new Error("Article is not public");
  }

  // Extract IP address from headers
  const ipAddress =
    headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    headers.get("x-real-ip") ||
    headers.get("cf-connecting-ip") ||
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

  const existingLike = await db.query.articleLikes.findFirst({
    where: eq(articleLikes.id, sessionId),
  });

  // if like exists, delete it and decrement the likes count
  if (existingLike) {
    await db.delete(articleLikes).where(eq(articleLikes.id, sessionId));
    return db
      .update(articles)
      .set({
        likes: sql`${articles.likes} - 1`,
      })
      .where(eq(articles.slug, input.slug));
  }

  // if like does not exist, increment the likes count
  await db.insert(articleLikes).values({
    id: sessionId,
  });

  return db
    .update(articles)
    .set({
      likes: sql`${articles.likes} + 1`,
    })
    .where(eq(articles.slug, input.slug));
}

export async function isLiked(
  db: DbClient,
  input: { slug: string },
  headers: Headers
) {
  // Extract IP address from headers (same logic as in like mutation)
  const ipAddress =
    headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    headers.get("x-real-ip") ||
    headers.get("cf-connecting-ip") ||
    "0.0.0.0";

  const currentUserId = createHash("sha512")
    .update(ipAddress + (env.IP_ADDRESS_SALT || "fallback-salt"), "utf8")
    .digest("hex");

  const sessionId = `${input.slug}_${currentUserId}`;

  const existingLike = await db.query.articleLikes.findFirst({
    where: eq(articleLikes.id, sessionId),
  });

  return Boolean(existingLike);
}

export async function view(db: DbClient, input: { slug: string }) {
  const article = await db.query.articles.findFirst({
    where: eq(articles.slug, input.slug),
  });

  if (!article) {
    throw new Error("Article not found");
  }

  // if article is draft, throw an error
  if (article.isDraft) {
    throw new Error("Article is not public");
  }

  // Insert view record with timestamp
  return db.insert(articleViews).values({
    articleId: article.id,
  });
}
