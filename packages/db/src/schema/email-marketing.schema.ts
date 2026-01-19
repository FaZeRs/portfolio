import { relations } from "drizzle-orm";
import { pgEnum, pgTable } from "drizzle-orm/pg-core";
import { createInsertSchema, createUpdateSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { user } from "./auth.schema";

// biome-ignore lint/style/noEnum: valid enum
export enum EmailCampaignStatus {
  DRAFT = "draft",
  SCHEDULED = "scheduled",
  SENDING = "sending",
  SENT = "sent",
  FAILED = "failed",
  CANCELLED = "cancelled",
}

export const emailCampaignStatusEnum = pgEnum(
  "email_campaign_status",
  EmailCampaignStatus
);

// biome-ignore lint/style/noEnum: valid enum
export enum EmailCampaignType {
  NEWSLETTER = "newsletter",
  NEW_CONTENT = "new_content",
  CUSTOM = "custom",
}

export const emailCampaignTypeEnum = pgEnum(
  "email_campaign_type",
  EmailCampaignType
);

export const emailSubscribers = pgTable("email_subscribers", (t) => ({
  id: t.uuid().notNull().primaryKey().defaultRandom(),
  email: t.varchar({ length: 255 }).notNull().unique(),
  name: t.varchar({ length: 255 }),
  isActive: t.boolean().notNull().default(true),
  subscribedAt: t.timestamp().defaultNow().notNull(),
  unsubscribedAt: t.timestamp(),
  unsubscribeToken: t.varchar({ length: 255 }).notNull().unique(),
  metadata: t.json().$type<Record<string, unknown>>(),
}));

export const emailCampaigns = pgTable("email_campaigns", (t) => ({
  id: t.uuid().notNull().primaryKey().defaultRandom(),
  name: t.varchar({ length: 255 }).notNull(),
  description: t.text(),
  emailType: emailCampaignTypeEnum()
    .notNull()
    .default(EmailCampaignType.NEWSLETTER),
  status: emailCampaignStatusEnum()
    .notNull()
    .default(EmailCampaignStatus.DRAFT),
  subject: t.varchar({ length: 255 }).notNull(),
  previewText: t.varchar({ length: 255 }),
  htmlContent: t.text().notNull(),
  textContent: t.text(),
  fromName: t.varchar({ length: 255 }),
  fromEmail: t.varchar({ length: 255 }),
  replyTo: t.varchar({ length: 255 }),
  scheduledAt: t.timestamp(),
  sentAt: t.timestamp(),
  retryCount: t.integer().notNull().default(0),
  maxRetries: t.integer().notNull().default(3),
  lastRetryAt: t.timestamp(),
  failureReason: t.text(),
  totalRecipients: t.integer().notNull().default(0),
  totalSent: t.integer().notNull().default(0),
  totalDelivered: t.integer().notNull().default(0),
  totalOpened: t.integer().notNull().default(0),
  totalClicked: t.integer().notNull().default(0),
  totalBounced: t.integer().notNull().default(0),
  totalUnsubscribed: t.integer().notNull().default(0),
  createdById: t
    .text()
    .references(() => user.id, { onDelete: "cascade" })
    .notNull(),
  createdAt: t.timestamp().defaultNow().notNull(),
  updatedAt: t
    .timestamp({ mode: "date", withTimezone: true })
    .$onUpdate(() => new Date()),
}));

export const emailTracking = pgTable("email_tracking", (t) => ({
  id: t.uuid().notNull().primaryKey().defaultRandom(),
  emailCampaignId: t
    .uuid()
    .references(() => emailCampaigns.id, { onDelete: "cascade" })
    .notNull(),
  subscriberId: t
    .uuid()
    .references(() => emailSubscribers.id, { onDelete: "cascade" })
    .notNull(),
  recipientEmail: t.varchar({ length: 255 }).notNull(),
  externalEmailId: t.varchar({ length: 255 }),
  sentAt: t.timestamp(),
  deliveredAt: t.timestamp(),
  openedAt: t.timestamp(),
  clickedAt: t.timestamp(),
  bouncedAt: t.timestamp(),
  unsubscribedAt: t.timestamp(),
  openCount: t.integer().notNull().default(0),
  clickCount: t.integer().notNull().default(0),
  metadata: t.json().$type<Record<string, unknown>>(),
  createdAt: t.timestamp().defaultNow().notNull(),
}));

export const emailCampaignRelations = relations(emailCampaigns, (t) => ({
  tracking: t.many(emailTracking),
  createdBy: t.one(user, {
    fields: [emailCampaigns.createdById],
    references: [user.id],
  }),
}));

export const emailTrackingRelations = relations(emailTracking, (t) => ({
  emailCampaign: t.one(emailCampaigns, {
    fields: [emailTracking.emailCampaignId],
    references: [emailCampaigns.id],
  }),
  subscriber: t.one(emailSubscribers, {
    fields: [emailTracking.subscriberId],
    references: [emailSubscribers.id],
  }),
}));

export const emailSubscriberRelations = relations(emailSubscribers, (t) => ({
  tracking: t.many(emailTracking),
}));

export const CreateEmailSubscriberSchema = createInsertSchema(
  emailSubscribers,
  {
    email: z.email("Invalid email address"),
    name: z.string().or(z.literal("")),
  }
).omit({
  id: true,
  subscribedAt: true,
  unsubscribedAt: true,
  unsubscribeToken: true,
});

export const CreateEmailCampaignSchema = createInsertSchema(emailCampaigns, {
  name: z
    .string()
    .min(1, "Campaign name is required")
    .max(255, "Campaign name cannot exceed 255 characters"),
  description: z.string().or(z.literal("")),
  emailType: z.nativeEnum(EmailCampaignType),
  subject: z
    .string()
    .min(1, "Subject is required")
    .max(255, "Subject cannot exceed 255 characters"),
  previewText: z.string().max(255).optional(),
  htmlContent: z.string().min(1, "Email content is required"),
  textContent: z.string().optional(),
  fromName: z.string().optional(),
  fromEmail: z.email().optional(),
  replyTo: z.email().optional(),
  scheduledAt: z.date().optional(),
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  sentAt: true,
  status: true,
  retryCount: true,
  maxRetries: true,
  lastRetryAt: true,
  failureReason: true,
  totalRecipients: true,
  totalSent: true,
  totalDelivered: true,
  totalOpened: true,
  totalClicked: true,
  totalBounced: true,
  totalUnsubscribed: true,
  createdById: true,
});

export const UpdateEmailCampaignSchema = createUpdateSchema(emailCampaigns, {
  id: z.uuid(),
  name: z.string().min(1).max(255).optional(),
  description: z.string().optional(),
  emailType: z.nativeEnum(EmailCampaignType).optional(),
  status: z.nativeEnum(EmailCampaignStatus).optional(),
  subject: z.string().min(1).max(255).optional(),
  htmlContent: z.string().min(1).optional(),
  textContent: z.string().optional(),
  scheduledAt: z.date().optional(),
}).omit({
  createdAt: true,
  updatedAt: true,
  sentAt: true,
  retryCount: true,
  maxRetries: true,
  lastRetryAt: true,
  failureReason: true,
  totalRecipients: true,
  totalSent: true,
  totalDelivered: true,
  totalOpened: true,
  totalClicked: true,
  totalBounced: true,
  totalUnsubscribed: true,
});

export const ScheduleEmailCampaignSchema = z.object({
  campaignId: z.uuid(),
  scheduledAt: z.date(),
});
