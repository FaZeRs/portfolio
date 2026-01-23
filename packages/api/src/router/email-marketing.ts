import {
  CreateEmailCampaignSchema,
  CreateEmailSubscriberSchema,
  EmailCampaignStatus,
  EmailCampaignType,
  emailCampaigns,
  emailSubscribers,
  emailTracking,
  ScheduleEmailCampaignSchema,
  UpdateEmailCampaignSchema,
} from "@acme/db/schema";
import { render } from "@react-email/components";
import { TRPCError, TRPCRouterRecord } from "@trpc/server";
import { desc, eq } from "drizzle-orm";
import { z } from "zod/v4";
import {
  emailMarketingService,
  generateUnsubscribeToken,
  NewContentEmail,
  NewsletterEmail,
  retryEmailCampaign,
  verifyUnsubscribeToken,
} from "../../../marketing/src";
import { protectedProcedure, publicProcedure } from "../trpc";

// Schema for rendering email preview
const RenderEmailPreviewSchema = z.object({
  emailType: z.nativeEnum(EmailCampaignType),
  subject: z.string(),
  htmlContent: z.string().optional(),
  previewText: z.string().optional(),
  contentTitle: z.string().optional(),
  contentDescription: z.string().optional(),
  contentUrl: z.string().optional(),
  contentType: z.enum(["blog", "project", "snippet"]).optional(),
});

// Schema for creating campaign with template
const CreateEmailCampaignWithTemplateSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  emailType: z.nativeEnum(EmailCampaignType),
  subject: z.string().min(1),
  previewText: z.string().optional(),
  // For NEWSLETTER and CUSTOM
  htmlContent: z.string().optional(),
  // For NEW_CONTENT
  contentTitle: z.string().optional(),
  contentDescription: z.string().optional(),
  contentUrl: z.string().optional(),
  contentType: z.enum(["blog", "project", "snippet"]).optional(),
  // Scheduling
  scheduledAt: z.date().optional(),
});

async function renderEmailHtml(
  input: z.infer<typeof RenderEmailPreviewSchema>
): Promise<string> {
  switch (input.emailType) {
    case EmailCampaignType.NEWSLETTER: {
      const hasContent = Boolean(input.htmlContent || input.subject);
      if (!hasContent) {
        return "";
      }
      return await render(
        NewsletterEmail({
          content: input.htmlContent || "",
          subject: input.subject || "Newsletter Preview",
          unsubscribeUrl: "{{unsubscribe_url}}",
        })
      );
    }
    case EmailCampaignType.NEW_CONTENT: {
      const hasContent = Boolean(
        input.contentTitle || input.contentDescription
      );
      if (!hasContent) {
        return "";
      }
      return await render(
        NewContentEmail({
          contentType: input.contentType || "blog",
          contentUrl: input.contentUrl || "#",
          description: input.contentDescription || "",
          title: input.contentTitle || "Content Title",
          unsubscribeUrl: "{{unsubscribe_url}}",
        })
      );
    }
    case EmailCampaignType.CUSTOM:
      return input.htmlContent || "";
    default:
      return "";
  }
}

export const emailMarketingRouter = {
  getAll: protectedProcedure.query(({ ctx }) =>
    ctx.db.query.emailCampaigns.findMany({
      orderBy: desc(emailCampaigns.createdAt),
      with: {
        createdBy: true,
      },
    })
  ),

  getById: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(({ ctx, input }) =>
      ctx.db.query.emailCampaigns.findFirst({
        where: eq(emailCampaigns.id, input.id),
        with: {
          tracking: true,
          createdBy: true,
        },
      })
    ),

  renderPreview: publicProcedure
    .input(RenderEmailPreviewSchema)
    .mutation(async ({ input }) => await renderEmailHtml(input)),

  createWithTemplate: protectedProcedure
    .input(CreateEmailCampaignWithTemplateSchema)
    .mutation(async ({ ctx, input }) => {
      const htmlContent = await renderEmailHtml({
        emailType: input.emailType,
        subject: input.subject,
        htmlContent: input.htmlContent,
        previewText: input.previewText,
        contentTitle: input.contentTitle,
        contentDescription: input.contentDescription,
        contentUrl: input.contentUrl,
        contentType: input.contentType,
      });

      const [campaign] = await ctx.db
        .insert(emailCampaigns)
        .values({
          name: input.name,
          description: input.description || "",
          emailType: input.emailType,
          subject: input.subject,
          htmlContent,
          previewText: input.previewText || "",
          createdById: ctx.session.user.id,
        })
        .returning();

      if (!campaign) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create email campaign",
        });
      }

      if (input.scheduledAt) {
        const minScheduleTime = new Date(Date.now() + 5 * 60 * 1000);
        if (input.scheduledAt < minScheduleTime) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Scheduled time must be at least 5 minutes in the future",
          });
        }

        await ctx.db
          .update(emailCampaigns)
          .set({
            status: EmailCampaignStatus.SCHEDULED,
            scheduledAt: input.scheduledAt,
          })
          .where(eq(emailCampaigns.id, campaign.id));
      }

      return campaign;
    }),

  create: protectedProcedure
    .input(CreateEmailCampaignSchema)
    .mutation(async ({ ctx, input }) => {
      const [campaign] = await ctx.db
        .insert(emailCampaigns)
        .values({
          ...input,
          createdById: ctx.session.user.id,
        })
        .returning();

      if (!campaign) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create email campaign",
        });
      }

      return campaign;
    }),

  update: protectedProcedure
    .input(UpdateEmailCampaignSchema)
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;

      const existing = await ctx.db.query.emailCampaigns.findFirst({
        where: eq(emailCampaigns.id, id),
      });

      if (!existing) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Campaign not found",
        });
      }

      // Only draft campaigns can be edited
      if (
        existing.status !== EmailCampaignStatus.DRAFT &&
        existing.status !== EmailCampaignStatus.FAILED
      ) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Only draft or failed campaigns can be edited",
        });
      }

      const [campaign] = await ctx.db
        .update(emailCampaigns)
        .set(data)
        .where(eq(emailCampaigns.id, id))
        .returning();

      if (!campaign) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Campaign not found",
        });
      }

      return campaign;
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .delete(emailCampaigns)
        .where(eq(emailCampaigns.id, input.id));

      return { success: true };
    }),

  send: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const campaign = await ctx.db.query.emailCampaigns.findFirst({
        where: eq(emailCampaigns.id, input.id),
      });

      if (!campaign) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Campaign not found",
        });
      }

      // Get active subscribers
      const subscribers = await ctx.db.query.emailSubscribers.findMany({
        where: eq(emailSubscribers.isActive, true),
      });

      if (subscribers.length === 0) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "No active subscribers found",
        });
      }

      // Update campaign status to sending
      await ctx.db
        .update(emailCampaigns)
        .set({ status: EmailCampaignStatus.SENDING })
        .where(eq(emailCampaigns.id, input.id));

      try {
        const result = await emailMarketingService.sendBulkEmails(
          subscribers.map((s) => ({
            email: s.email,
            name: s.name || undefined,
          })),
          campaign.subject,
          campaign.htmlContent,
          campaign.textContent || undefined,
          campaign.fromName || undefined,
          campaign.fromEmail || undefined,
          campaign.replyTo || undefined
        );

        // Create tracking records only for subscribers that exist
        const trackingRecords = result.successful
          .map((success) => {
            const subscriber = subscribers.find(
              (s) => s.email === success.email
            );
            if (!subscriber) {
              return null;
            }

            return {
              emailCampaignId: campaign.id,
              subscriberId: subscriber.id,
              recipientEmail: success.email,
              externalEmailId: success.emailId,
              sentAt: new Date(),
            };
          })
          .filter(
            (record): record is NonNullable<typeof record> => record !== null
          );

        if (trackingRecords.length > 0) {
          await ctx.db.insert(emailTracking).values(trackingRecords);
        }

        const finalStatus =
          result.totalFailed === 0
            ? EmailCampaignStatus.SENT
            : EmailCampaignStatus.FAILED;

        await ctx.db
          .update(emailCampaigns)
          .set({
            status: finalStatus,
            sentAt: new Date(),
            totalRecipients: subscribers.length,
            totalSent: result.totalSent,
            failureReason:
              finalStatus === EmailCampaignStatus.FAILED
                ? `Failed to send ${result.totalFailed} out of ${subscribers.length} emails`
                : null,
          })
          .where(eq(emailCampaigns.id, input.id));

        return {
          totalSent: result.totalSent,
          totalFailed: result.totalFailed,
          successful: result.successful,
          failed: result.failed,
        };
      } catch (error) {
        // Rollback campaign status on error
        await ctx.db
          .update(emailCampaigns)
          .set({
            status: EmailCampaignStatus.FAILED,
            failureReason:
              error instanceof Error ? error.message : "Unknown error",
          })
          .where(eq(emailCampaigns.id, input.id));

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message:
            error instanceof Error
              ? error.message
              : "Failed to send email campaign",
        });
      }
    }),

  schedule: protectedProcedure
    .input(ScheduleEmailCampaignSchema)
    .mutation(async ({ ctx, input }) => {
      // Validate scheduled time is at least 5 minutes in the future
      const minScheduleTime = new Date(Date.now() + 5 * 60 * 1000);
      if (input.scheduledAt < minScheduleTime) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Scheduled time must be at least 5 minutes in the future",
        });
      }

      const campaign = await ctx.db.query.emailCampaigns.findFirst({
        where: eq(emailCampaigns.id, input.campaignId),
      });

      if (!campaign) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Campaign not found",
        });
      }

      // Only draft campaigns can be scheduled
      if (campaign.status !== EmailCampaignStatus.DRAFT) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Only draft campaigns can be scheduled",
        });
      }

      // Update campaign to scheduled
      const [updated] = await ctx.db
        .update(emailCampaigns)
        .set({
          status: EmailCampaignStatus.SCHEDULED,
          scheduledAt: input.scheduledAt,
        })
        .where(eq(emailCampaigns.id, input.campaignId))
        .returning();

      if (!updated) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to schedule campaign",
        });
      }

      return updated;
    }),

  cancelSchedule: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const campaign = await ctx.db.query.emailCampaigns.findFirst({
        where: eq(emailCampaigns.id, input.id),
      });

      if (!campaign) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Campaign not found",
        });
      }

      // Only scheduled campaigns can be cancelled
      if (campaign.status !== EmailCampaignStatus.SCHEDULED) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Only scheduled campaigns can be cancelled",
        });
      }

      // Update campaign back to draft
      const [updated] = await ctx.db
        .update(emailCampaigns)
        .set({
          status: EmailCampaignStatus.DRAFT,
          scheduledAt: null,
        })
        .where(eq(emailCampaigns.id, input.id))
        .returning();

      if (!updated) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to cancel schedule",
        });
      }

      return updated;
    }),

  retry: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ input }) => {
      const result = await retryEmailCampaign(input.id);

      if (!result.success) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: result.message,
        });
      }

      return result;
    }),

  getAnalytics: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const campaign = await ctx.db.query.emailCampaigns.findFirst({
        where: eq(emailCampaigns.id, input.id),
        with: {
          tracking: true,
        },
      });

      if (!campaign) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Campaign not found",
        });
      }

      return {
        campaign,
        stats: {
          totalRecipients: campaign.totalRecipients,
          totalSent: campaign.totalSent,
          totalDelivered: campaign.totalDelivered,
          totalOpened: campaign.totalOpened,
          totalClicked: campaign.totalClicked,
          totalBounced: campaign.totalBounced,
          totalUnsubscribed: campaign.totalUnsubscribed,
          openRate:
            campaign.totalSent > 0
              ? (campaign.totalOpened / campaign.totalSent) * 100
              : 0,
          clickRate:
            campaign.totalSent > 0
              ? (campaign.totalClicked / campaign.totalSent) * 100
              : 0,
        },
      };
    }),

  subscribe: publicProcedure
    .input(
      z.object({
        email: z.email("Invalid email address"),
        name: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Check if subscriber already exists
      const existing = await ctx.db.query.emailSubscribers.findFirst({
        where: eq(emailSubscribers.email, input.email),
      });

      if (existing) {
        // If exists but unsubscribed, reactivate
        if (!existing.isActive) {
          await ctx.db
            .update(emailSubscribers)
            .set({ isActive: true, unsubscribedAt: null })
            .where(eq(emailSubscribers.id, existing.id));

          return { success: true, reactivated: true };
        }

        // Already subscribed
        return { success: true, alreadySubscribed: true };
      }

      const unsubscribeToken = generateUnsubscribeToken(input.email);

      await ctx.db.insert(emailSubscribers).values({
        email: input.email,
        name: input.name || null,
        unsubscribeToken,
      });

      return { success: true };
    }),

  unsubscribeByToken: publicProcedure
    .input(z.object({ token: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // Verify and extract email from token
      const email = verifyUnsubscribeToken(input.token);

      if (!email) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Invalid or expired unsubscribe token",
        });
      }

      // Find and update subscriber
      const [updated] = await ctx.db
        .update(emailSubscribers)
        .set({
          isActive: false,
          unsubscribedAt: new Date(),
        })
        .where(eq(emailSubscribers.email, email))
        .returning();

      if (!updated) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Subscriber not found",
        });
      }

      return updated;
    }),

  getAllSubscribers: protectedProcedure.query(({ ctx }) =>
    ctx.db.query.emailSubscribers.findMany({
      orderBy: desc(emailSubscribers.subscribedAt),
    })
  ),

  createSubscriber: protectedProcedure
    .input(CreateEmailSubscriberSchema)
    .mutation(async ({ ctx, input }) => {
      // Check if subscriber already exists
      const existing = await ctx.db.query.emailSubscribers.findFirst({
        where: eq(emailSubscribers.email, input.email),
      });

      if (existing) {
        // If exists but unsubscribed, reactivate
        if (!existing.isActive) {
          const [updated] = await ctx.db
            .update(emailSubscribers)
            .set({ isActive: true, unsubscribedAt: null })
            .where(eq(emailSubscribers.id, existing.id))
            .returning();

          if (!updated) {
            throw new TRPCError({
              code: "INTERNAL_SERVER_ERROR",
              message: "Failed to reactivate subscriber",
            });
          }

          return updated;
        }

        throw new TRPCError({
          code: "CONFLICT",
          message: "Subscriber already exists",
        });
      }

      const unsubscribeToken = generateUnsubscribeToken(input.email);

      const [subscriber] = await ctx.db
        .insert(emailSubscribers)
        .values({ ...input, unsubscribeToken })
        .returning();

      if (!subscriber) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create subscriber",
        });
      }

      return subscriber;
    }),

  unsubscribe: protectedProcedure
    .input(z.object({ email: z.string().email() }))
    .mutation(async ({ ctx, input }) => {
      const [updated] = await ctx.db
        .update(emailSubscribers)
        .set({
          isActive: false,
          unsubscribedAt: new Date(),
        })
        .where(eq(emailSubscribers.email, input.email))
        .returning();

      if (!updated) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Subscriber not found",
        });
      }

      return updated;
    }),

  deleteSubscriber: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .delete(emailSubscribers)
        .where(eq(emailSubscribers.id, input.id));

      return { success: true };
    }),
} satisfies TRPCRouterRecord;
