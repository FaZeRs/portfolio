import { relations } from "drizzle-orm";
import { pgEnum, pgTable } from "drizzle-orm/pg-core";
import { createInsertSchema, createUpdateSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { user } from "./auth.schema";

// biome-ignore lint/style/noEnum: valid enum
export enum SocialPlatform {
  TWITTER = "twitter",
  LINKEDIN = "linkedin",
  FACEBOOK = "facebook",
  DEVTO = "devto",
}

export const socialPlatformEnum = pgEnum("social_platform", SocialPlatform);

// biome-ignore lint/style/noEnum: valid enum
export enum SocialPostStatus {
  DRAFT = "draft",
  SCHEDULED = "scheduled",
  PUBLISHING = "publishing",
  PUBLISHED = "published",
  FAILED = "failed",
}

export const socialPostStatusEnum = pgEnum(
  "social_post_status",
  SocialPostStatus
);

export const socialMediaPosts = pgTable("social_media_posts", (t) => ({
  id: t.uuid().notNull().primaryKey().defaultRandom(),
  name: t.varchar({ length: 255 }).notNull(),
  description: t.text(),
  platform: socialPlatformEnum().notNull(),
  content: t.text().notNull(),
  mediaUrls: t.text().array(),
  externalPostId: t.varchar({ length: 255 }),
  postUrl: t.varchar({ length: 500 }),
  status: socialPostStatusEnum().notNull().default(SocialPostStatus.DRAFT),
  scheduledAt: t.timestamp(),
  publishedAt: t.timestamp(),
  failureReason: t.text(),
  retryCount: t.integer().notNull().default(0),
  maxRetries: t.integer().notNull().default(3),
  lastRetryAt: t.timestamp(),
  likes: t.integer().notNull().default(0),
  shares: t.integer().notNull().default(0),
  comments: t.integer().notNull().default(0),
  impressions: t.integer().notNull().default(0),
  createdById: t
    .text()
    .references(() => user.id, { onDelete: "cascade" })
    .notNull(),
  createdAt: t.timestamp().defaultNow().notNull(),
  updatedAt: t
    .timestamp({ mode: "date", withTimezone: true })
    .$onUpdate(() => new Date()),
}));

export const socialMediaPostRelations = relations(socialMediaPosts, (t) => ({
  createdBy: t.one(user, {
    fields: [socialMediaPosts.createdById],
    references: [user.id],
  }),
}));

export const CreateSocialMediaPostSchema = createInsertSchema(
  socialMediaPosts,
  {
    name: z
      .string()
      .min(1, "Post name is required")
      .max(255, "Post name cannot exceed 255 characters"),
    description: z.string().or(z.literal("")),
    platform: z.nativeEnum(SocialPlatform),
    content: z.string().min(1, "Post content is required"),
    mediaUrls: z.array(z.url()).optional(),
    scheduledAt: z.date().optional(),
  }
).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  externalPostId: true,
  postUrl: true,
  status: true,
  publishedAt: true,
  failureReason: true,
  retryCount: true,
  maxRetries: true,
  lastRetryAt: true,
  likes: true,
  shares: true,
  comments: true,
  impressions: true,
  createdById: true,
});

export const UpdateSocialMediaPostSchema = createUpdateSchema(
  socialMediaPosts,
  {
    id: z.uuid(),
    name: z.string().min(1).max(255).optional(),
    description: z.string().optional(),
    platform: z.nativeEnum(SocialPlatform).optional(),
    content: z.string().min(1).optional(),
    mediaUrls: z.array(z.url()).optional(),
    status: z.nativeEnum(SocialPostStatus).optional(),
    scheduledAt: z.date().optional(),
  }
).omit({
  createdAt: true,
  updatedAt: true,
  externalPostId: true,
  postUrl: true,
  publishedAt: true,
  failureReason: true,
  retryCount: true,
  maxRetries: true,
  lastRetryAt: true,
  likes: true,
  shares: true,
  comments: true,
  impressions: true,
});

export const ScheduleSocialPostSchema = z.object({
  postId: z.uuid(),
  scheduledAt: z.date(),
});
