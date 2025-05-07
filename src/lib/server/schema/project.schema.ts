import { relations } from "drizzle-orm";
import { pgTable, primaryKey, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema, createUpdateSchema } from "drizzle-zod";
import { z } from "zod";

export const Stack = pgTable("stack", (t) => ({
  id: t.uuid().notNull().primaryKey().defaultRandom(),
  name: t.varchar({ length: 255 }).notNull(),
}));

export const StackRelations = relations(Stack, ({ many }) => ({
  projects: many(Project),
}));

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
  createdAt: t.timestamp().defaultNow().notNull(),
  updatedAt: t
    .timestamp({ mode: "date", withTimezone: true })
    .$onUpdate(() => new Date()),
}));

export const ProjectRelations = relations(Project, ({ many }) => ({
  stacks: many(Stack),
}));

export const stacksToProjects = pgTable(
  "stacks_to_projects",
  {
    stackId: uuid("stack_id")
      .notNull()
      .references(() => Stack.id),
    projectId: uuid("project_id")
      .notNull()
      .references(() => Project.id),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.stackId, t.projectId] }),
  }),
);

export const stacksToProjectsRelations = relations(stacksToProjects, ({ one }) => ({
  stack: one(Stack, {
    fields: [stacksToProjects.stackId],
    references: [Stack.id],
  }),
  project: one(Project, {
    fields: [stacksToProjects.projectId],
    references: [Project.id],
  }),
}));

const ProjectBaseSchema = {
  title: z
    .string()
    .min(1, "Title is required")
    .max(255, "Title cannot exceed 255 characters"),
  slug: z
    .string()
    .min(1, "Slug is required")
    .max(255, "Slug cannot exceed 255 characters")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug must contain only lowercase letters, numbers, and hyphens",
    ),
  description: z.string().max(255, "Description cannot exceed 255 characters"),
  content: z.string(),
  imageUrl: z.string().url("Please enter a valid image URL").max(255).or(z.literal("")),
  githubUrl: z.string().url("Please enter a valid GitHub URL").max(255).or(z.literal("")),
  demoUrl: z.string().url("Please enter a valid demo URL").max(255).or(z.literal("")),
  isFeatured: z.boolean(),
  isDraft: z.boolean(),
};

export const CreateProjectSchema = createInsertSchema(Project, {
  title: ProjectBaseSchema.title,
  slug: ProjectBaseSchema.slug,
  description: ProjectBaseSchema.description,
  content: ProjectBaseSchema.content,
  imageUrl: ProjectBaseSchema.imageUrl,
  githubUrl: ProjectBaseSchema.githubUrl,
  demoUrl: ProjectBaseSchema.demoUrl,
  isFeatured: ProjectBaseSchema.isFeatured,
  isDraft: ProjectBaseSchema.isDraft,
})
  .omit({
    id: true,
    createdAt: true,
    updatedAt: true,
  })
  .and(
    z.object({
      thumbnail: z.string().describe("File upload for project thumbnail"),
    }),
  );

export const UpdateProjectSchema = createUpdateSchema(Project, {
  id: z.string(),
  title: ProjectBaseSchema.title,
  slug: ProjectBaseSchema.slug,
  description: ProjectBaseSchema.description,
  content: ProjectBaseSchema.content,
  imageUrl: ProjectBaseSchema.imageUrl,
  githubUrl: ProjectBaseSchema.githubUrl,
  demoUrl: ProjectBaseSchema.demoUrl,
  isFeatured: ProjectBaseSchema.isFeatured,
  isDraft: ProjectBaseSchema.isDraft,
})
  .omit({
    createdAt: true,
    updatedAt: true,
  })
  .and(
    z.object({
      thumbnail: z.string().describe("File upload for project thumbnail"),
    }),
  );
