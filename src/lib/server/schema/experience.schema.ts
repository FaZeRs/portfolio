import { pgEnum, pgTable } from "drizzle-orm/pg-core";
import { createInsertSchema, createUpdateSchema } from "drizzle-zod";
import { z } from "zod/v4";

export enum ExperienceType {
  WORK = "work",
  EDUCATION = "education",
  VOLUNTEER = "volunteer",
  CERTIFICATION = "certification",
}

export const experienceTypeEnum = pgEnum("experience_type", ExperienceType);

export const Experience = pgTable("experience", (t) => ({
  id: t.uuid().notNull().primaryKey().defaultRandom(),
  title: t.varchar({ length: 255 }).notNull(),
  description: t.varchar({ length: 255 }),
  imageUrl: t.varchar({ length: 255 }),
  startDate: t.date({ mode: "string" }),
  endDate: t.date({ mode: "string" }),
  institution: t.varchar({ length: 255 }),
  url: t.varchar({ length: 255 }),
  type: experienceTypeEnum("type").default(ExperienceType.WORK),
  isDraft: t.boolean().notNull().default(false),
  isOnGoing: t.boolean().notNull().default(false),
  createdAt: t.timestamp().defaultNow().notNull(),
  updatedAt: t
    .timestamp({ mode: "date", withTimezone: true })
    .$onUpdate(() => new Date()),
}));

export const ExperienceBaseSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(255, "Title cannot exceed 255 characters"),
  description: z
    .string()
    .max(255, "Description cannot exceed 255 characters")
    .or(z.literal("")),
  startDate: z.string().or(z.literal("")),
  endDate: z.string().or(z.literal("")),
  institution: z
    .string()
    .max(255, "Institution cannot exceed 255 characters")
    .or(z.literal("")),
  url: z.string().url().or(z.literal("")),
  type: z.nativeEnum(ExperienceType),
  isDraft: z.boolean().or(z.literal(false)),
  isOnGoing: z.boolean().or(z.literal(false)),
  thumbnail: z.string().describe("File upload for experience thumbnail"),
});

export const CreateExperienceSchema = createInsertSchema(Experience, {
  title: ExperienceBaseSchema.shape.title,
  description: ExperienceBaseSchema.shape.description,
  startDate: ExperienceBaseSchema.shape.startDate,
  endDate: ExperienceBaseSchema.shape.endDate,
  institution: ExperienceBaseSchema.shape.institution,
  url: ExperienceBaseSchema.shape.url,
  type: ExperienceBaseSchema.shape.type,
  isDraft: ExperienceBaseSchema.shape.isDraft,
  isOnGoing: ExperienceBaseSchema.shape.isOnGoing,
})
  .omit({
    id: true,
    createdAt: true,
    updatedAt: true,
  })
  .and(
    z.object({
      thumbnail: ExperienceBaseSchema.shape.thumbnail,
    }),
  );

export const UpdateExperienceSchema = createUpdateSchema(Experience, {
  id: z.string().uuid(),
  title: ExperienceBaseSchema.shape.title,
  description: ExperienceBaseSchema.shape.description,
  startDate: ExperienceBaseSchema.shape.startDate,
  endDate: ExperienceBaseSchema.shape.endDate,
  institution: ExperienceBaseSchema.shape.institution,
  url: ExperienceBaseSchema.shape.url,
  type: ExperienceBaseSchema.shape.type,
  isDraft: ExperienceBaseSchema.shape.isDraft,
  isOnGoing: ExperienceBaseSchema.shape.isOnGoing,
})
  .omit({
    createdAt: true,
    updatedAt: true,
  })
  .and(
    z.object({
      thumbnail: ExperienceBaseSchema.shape.thumbnail,
    }),
  );
