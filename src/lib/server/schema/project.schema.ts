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

const BaseProjectSchema = {
  title: z.string().min(1, "Title is required").max(255),
  slug: z
    .string()
    .min(1, "Slug is required")
    .max(255)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  description: z.string().max(255),
  content: z.string(),
  githubUrl: z.string().max(255).url().optional().or(z.literal("")),
  demoUrl: z.string().max(255).url().optional().or(z.literal("")),
  stacks: z.array(z.string()),
  isFeatured: z.boolean(),
  isDraft: z.boolean(),
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
