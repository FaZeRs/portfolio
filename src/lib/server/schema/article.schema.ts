import { relations } from "drizzle-orm";
import { pgTable } from "drizzle-orm/pg-core";
import { createInsertSchema, createUpdateSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { user } from "./auth.schema";

export const articles = pgTable("articles", (t) => ({
  id: t.uuid().notNull().primaryKey().defaultRandom(),
  title: t.varchar({ length: 255 }).notNull(),
  slug: t.varchar({ length: 255 }).notNull().unique(),
  description: t.varchar({ length: 255 }),
  content: t.text(),
  imageUrl: t.varchar({ length: 255 }),
  isDraft: t.boolean().notNull().default(false),
  tags: t.text().array(),
  author: t
    .text()
    .references(() => user.id)
    .notNull(),
  likes: t.integer().notNull().default(0),
  views: t.integer().notNull().default(0),
  createdAt: t.timestamp().defaultNow().notNull(),
  updatedAt: t
    .timestamp({ mode: "date", withTimezone: true })
    .$onUpdate(() => new Date()),
}));

export const articleRelations = relations(articles, (t) => ({
  comments: t.many(comments),
}));

export const comments = pgTable("comments", (t) => ({
  id: t.uuid().notNull().primaryKey().defaultRandom(),
  articleId: t
    .uuid()
    .references(() => articles.id)
    .notNull(),
  userId: t
    .text()
    .references(() => user.id)
    .notNull(),
  comment: t.text().notNull(),
  createdAt: t.timestamp().defaultNow().notNull(),
  updatedAt: t.timestamp().defaultNow().notNull(),
}));

export const commentReactions = pgTable("comment_reactions", (t) => ({
  id: t.uuid().notNull().primaryKey().defaultRandom(),
  commentId: t
    .uuid()
    .references(() => comments.id)
    .notNull(),
  userId: t
    .text()
    .references(() => user.id)
    .notNull(),
  like: t.boolean().notNull(),
  createdAt: t.timestamp().defaultNow().notNull(),
}));

export const articleCommentRelations = relations(comments, (t) => ({
  reactions: t.many(commentReactions),
  article: t.one(articles, {
    fields: [comments.articleId],
    references: [articles.id],
  }),
  user: t.one(user, {
    fields: [comments.userId],
    references: [user.id],
  }),
}));

export const articleLikes = pgTable("article_likes", (t) => ({
  id: t.text().notNull().primaryKey(),
  createdAt: t.timestamp().defaultNow().notNull(),
}));

const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const ArticleBaseSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(255, "Title cannot exceed 255 characters"),
  slug: z
    .string()
    .min(1, "Slug is required")
    .max(255, "Slug cannot exceed 255 characters")
    .regex(
      slugRegex,
      "Slug must contain only lowercase letters, numbers, and hyphens",
    ),
  description: z
    .string()
    .max(255, "Description cannot exceed 255 characters")
    .or(z.literal("")),
  content: z.string().or(z.literal("")),
  thumbnail: z.string().describe("File upload for project thumbnail"),
  isDraft: z.boolean().or(z.literal(false)),
  tags: z.array(z.string()),
});

export const CreateArticleSchema = createInsertSchema(articles, {
  title: ArticleBaseSchema.shape.title,
  slug: ArticleBaseSchema.shape.slug,
  description: ArticleBaseSchema.shape.description,
  content: ArticleBaseSchema.shape.content,
  isDraft: ArticleBaseSchema.shape.isDraft,
  tags: ArticleBaseSchema.shape.tags,
  author: z.string(),
})
  .omit({
    id: true,
    createdAt: true,
    updatedAt: true,
  })
  .and(
    z.object({
      thumbnail: ArticleBaseSchema.shape.thumbnail,
    }),
  );

export const UpdateArticleSchema = createUpdateSchema(articles, {
  id: z.uuid(),
  title: ArticleBaseSchema.shape.title,
  slug: ArticleBaseSchema.shape.slug,
  description: ArticleBaseSchema.shape.description,
  content: ArticleBaseSchema.shape.content,
  isDraft: ArticleBaseSchema.shape.isDraft,
  tags: ArticleBaseSchema.shape.tags,
})
  .omit({
    createdAt: true,
    updatedAt: true,
  })
  .and(
    z.object({
      thumbnail: ArticleBaseSchema.shape.thumbnail,
    }),
  );
