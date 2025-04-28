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

export const CreateProjectSchema = createInsertSchema(Project, {
  title: z.string().max(255),
  slug: z
    .string()
    .max(255)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  description: z.string().max(255).optional(),
  content: z.string().optional(),
  imageUrl: z.string().url().max(255).optional().or(z.literal("")),
  githubUrl: z.string().url().max(255).optional().or(z.literal("")),
  demoUrl: z.string().url().max(255).optional().or(z.literal("")),
  stacks: z.array(z.string()).optional(),
  isFeatured: z.boolean().optional(),
  isDraft: z.boolean().optional(),
})
  .omit({
    id: true,
    createdAt: true,
    updatedAt: true,
  })
  .and(
    z.object({
      thumbnail: z.string().optional(),
    }),
  );

export const UpdateProjectSchema = createUpdateSchema(Project, {
  id: z.string(),
  title: z.string().max(255).optional(),
  slug: z
    .string()
    .max(255)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
    .optional(),
  description: z.string().max(255).optional(),
  content: z.string().optional(),
  imageUrl: z.string().url().max(255).optional().or(z.literal("")),
  githubUrl: z.string().url().max(255).optional().or(z.literal("")),
  demoUrl: z.string().url().max(255).optional().or(z.literal("")),
  stacks: z.array(z.string()).optional(),
  isFeatured: z.boolean().optional(),
  isDraft: z.boolean().optional(),
})
  .omit({
    createdAt: true,
    updatedAt: true,
  })
  .and(
    z.object({
      thumbnail: z.string().optional(),
    }),
  );
