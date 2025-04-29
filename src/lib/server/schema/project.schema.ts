import { pgTable } from "drizzle-orm/pg-core";
import { createInsertSchema, createUpdateSchema } from "drizzle-zod";
import { z } from "zod";

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

const BaseProjectSchema = {
  title: z
    .string()
    .min(1, "Title is required")
    .max(255, "Title must be less than 255 characters"),
  slug: z
    .string()
    .min(1, "Slug is required")
    .max(255, "Slug must be less than 255 characters")
    .regex(slugRegex, "Slug must contain only lowercase letters, numbers, and hyphens"),
  description: z
    .string()
    .max(255, "Description must be less than 255 characters")
    .optional()
    .or(z.literal("")),
  content: z.string().optional().or(z.literal("")),
  githubUrl: z
    .string()
    .max(255, "GitHub URL must be less than 255 characters")
    .url("Please enter a valid URL")
    .optional()
    .or(z.literal("")),
  demoUrl: z
    .string()
    .max(255, "Demo URL must be less than 255 characters")
    .url("Please enter a valid URL")
    .optional()
    .or(z.literal("")),
  stacks: z.array(z.string(), {
    invalid_type_error: "Technology stacks must be an array of strings",
  }),
  isFeatured: z.boolean({
    invalid_type_error: "Featured status must be a boolean",
  }),
  isDraft: z.boolean({
    invalid_type_error: "Draft status must be a boolean",
  }),
};

export const CreateProjectSchema = createInsertSchema(Project, BaseProjectSchema)
  .omit({
    id: true,
    createdAt: true,
    updatedAt: true,
  })
  .and(
    z.object({
      thumbnail: z.string(),
    }),
  );

export const UpdateProjectSchema = createUpdateSchema(Project, {
  ...BaseProjectSchema,
  id: z.string(),
})
  .omit({
    createdAt: true,
    updatedAt: true,
  })
  .and(
    z.object({
      thumbnail: z.string(),
    }),
  );
