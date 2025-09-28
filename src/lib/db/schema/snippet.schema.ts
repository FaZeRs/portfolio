/** biome-ignore-all lint/style/noMagicNumbers: valid constant */
import { pgTable } from "drizzle-orm/pg-core";
import { createInsertSchema, createUpdateSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const Snippet = pgTable("snippet", (t) => ({
  id: t.uuid().notNull().primaryKey().defaultRandom(),
  title: t.varchar({ length: 255 }).notNull(),
  slug: t.varchar({ length: 255 }).notNull().unique(),
  description: t.varchar({ length: 255 }),
  category: t.varchar({ length: 255 }),
  code: t.text(),
  isDraft: t.boolean().notNull().default(false),
  createdAt: t.timestamp().defaultNow().notNull(),
  updatedAt: t
    .timestamp({ mode: "date", withTimezone: true })
    .$onUpdate(() => new Date()),
}));

const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const SnippetBaseSchema = z.object({
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
      "Slug must contain only lowercase letters, numbers, and hyphens"
    ),
  description: z
    .string()
    .max(255, "Description cannot exceed 255 characters")
    .or(z.literal("")),
  category: z
    .string()
    .min(1, "Category is required")
    .max(255, "Category cannot exceed 255 characters"),
  code: z.string().or(z.literal("")),
  isDraft: z.boolean().or(z.literal(false)),
});

export const CreateSnippetSchema = createInsertSchema(Snippet, {
  title: SnippetBaseSchema.shape.title,
  slug: SnippetBaseSchema.shape.slug,
  description: SnippetBaseSchema.shape.description,
  category: SnippetBaseSchema.shape.category,
  code: SnippetBaseSchema.shape.code,
  isDraft: SnippetBaseSchema.shape.isDraft,
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const UpdateSnippetSchema = createUpdateSchema(Snippet, {
  id: z.uuid(),
  title: SnippetBaseSchema.shape.title,
  slug: SnippetBaseSchema.shape.slug,
  description: SnippetBaseSchema.shape.description,
  category: SnippetBaseSchema.shape.category,
  code: SnippetBaseSchema.shape.code,
  isDraft: SnippetBaseSchema.shape.isDraft,
}).omit({
  createdAt: true,
  updatedAt: true,
});
