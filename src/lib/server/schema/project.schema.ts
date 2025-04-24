import { relations, sql } from "drizzle-orm";
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
  isFeature: t.boolean().notNull().default(false),
  githubUrl: t.varchar({ length: 255 }),
  demoUrl: t.varchar({ length: 255 }),
  createdAt: t.timestamp().defaultNow().notNull(),
  updatedAt: t
    .timestamp({ mode: "date", withTimezone: true })
    .$onUpdateFn(() => sql`now()`),
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
