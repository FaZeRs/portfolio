/** biome-ignore-all lint/style/noMagicNumbers: valid constant */
import { pgTable } from "drizzle-orm/pg-core";
import { createInsertSchema, createUpdateSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const Service = pgTable("service", (t) => ({
  id: t.uuid().notNull().primaryKey().defaultRandom(),
  title: t.varchar({ length: 255 }).notNull(),
  slug: t.varchar({ length: 255 }).notNull().unique(),
  description: t.varchar({ length: 255 }),
  content: t.text(),
  imageUrl: t.varchar({ length: 255 }),
  isDraft: t.boolean().notNull().default(false),
  stacks: t.text().array(),
  createdAt: t.timestamp().defaultNow().notNull(),
  updatedAt: t
    .timestamp({ mode: "date", withTimezone: true })
    .$onUpdate(() => new Date()),
}));

const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const ServiceBaseSchema = z.object({
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
  thumbnail: z.string().describe("File upload for service thumbnail"),
  isDraft: z.boolean().or(z.literal(false)),
  stacks: z.array(z.string()),
});

export const CreateServiceSchema = createInsertSchema(Service, {
  title: ServiceBaseSchema.shape.title,
  slug: ServiceBaseSchema.shape.slug,
  description: ServiceBaseSchema.shape.description,
  content: ServiceBaseSchema.shape.content,
  isDraft: ServiceBaseSchema.shape.isDraft,
})
  .omit({
    id: true,
    createdAt: true,
    updatedAt: true,
  })
  .and(
    z.object({
      thumbnail: ServiceBaseSchema.shape.thumbnail,
    })
  );

export const UpdateServiceSchema = createUpdateSchema(Service, {
  id: z.uuid(),
  title: ServiceBaseSchema.shape.title,
  slug: ServiceBaseSchema.shape.slug,
  description: ServiceBaseSchema.shape.description,
  content: ServiceBaseSchema.shape.content,
  isDraft: ServiceBaseSchema.shape.isDraft,
})
  .omit({
    createdAt: true,
    updatedAt: true,
  })
  .and(
    z.object({
      thumbnail: ServiceBaseSchema.shape.thumbnail,
    })
  );
