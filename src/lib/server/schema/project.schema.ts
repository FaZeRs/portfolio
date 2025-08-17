/** biome-ignore-all lint/style/noMagicNumbers: valid constant */
import { pgTable } from "drizzle-orm/pg-core";
import { createInsertSchema, createUpdateSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const Project = pgTable("project", (t) => ({
  id: t.uuid().notNull().primaryKey().defaultRandom(),
  title: t.varchar({ length: 255 }).notNull(),
  slug: t.varchar({ length: 255 }).notNull().unique(),
  description: t.varchar({ length: 255 }),
  content: t.text(),
  imageUrl: t.varchar({ length: 255 }),
  isFeatured: t.boolean().notNull().default(false),
  githubUrl: t.varchar({ length: 255 }),
  demoUrl: t.varchar({ length: 255 }),
  isDraft: t.boolean().notNull().default(false),
  stacks: t.text().array(),
  createdAt: t.timestamp().defaultNow().notNull(),
  updatedAt: t
    .timestamp({ mode: "date", withTimezone: true })
    .$onUpdate(() => new Date()),
}));

const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const ProjectBaseSchema = z.object({
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
  content: z.string().or(z.literal("")),
  thumbnail: z.string().describe("File upload for project thumbnail"),
  githubUrl: z
    .string()
    .url("Please enter a valid GitHub URL")
    .max(255)
    .or(z.literal("")),
  demoUrl: z
    .string()
    .url("Please enter a valid demo URL")
    .max(255)
    .or(z.literal("")),
  isFeatured: z.boolean().or(z.literal(false)),
  isDraft: z.boolean().or(z.literal(false)),
  stacks: z.array(z.string()),
});

export const CreateProjectSchema = createInsertSchema(Project, {
  title: ProjectBaseSchema.shape.title,
  slug: ProjectBaseSchema.shape.slug,
  description: ProjectBaseSchema.shape.description,
  content: ProjectBaseSchema.shape.content,
  githubUrl: ProjectBaseSchema.shape.githubUrl,
  demoUrl: ProjectBaseSchema.shape.demoUrl,
  isFeatured: ProjectBaseSchema.shape.isFeatured,
  isDraft: ProjectBaseSchema.shape.isDraft,
})
  .omit({
    id: true,
    createdAt: true,
    updatedAt: true,
  })
  .and(
    z.object({
      thumbnail: ProjectBaseSchema.shape.thumbnail,
    })
  );

export const UpdateProjectSchema = createUpdateSchema(Project, {
  id: z.string().uuid(),
  title: ProjectBaseSchema.shape.title,
  slug: ProjectBaseSchema.shape.slug,
  description: ProjectBaseSchema.shape.description,
  content: ProjectBaseSchema.shape.content,
  githubUrl: ProjectBaseSchema.shape.githubUrl,
  demoUrl: ProjectBaseSchema.shape.demoUrl,
  isFeatured: ProjectBaseSchema.shape.isFeatured,
  isDraft: ProjectBaseSchema.shape.isDraft,
})
  .omit({
    createdAt: true,
    updatedAt: true,
  })
  .and(
    z.object({
      thumbnail: ProjectBaseSchema.shape.thumbnail,
    })
  );
