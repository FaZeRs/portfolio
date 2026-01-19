import { db } from "@acme/db/client";
import {
  EmailCampaignStatus,
  emailCampaigns,
  emailSubscribers,
} from "@acme/db/schema";
import { and, eq, lte } from "drizzle-orm";
import { emailMarketingService } from "./email-service";

const MAX_RETRY_DELAY_MS = 60 * 60 * 1000; // 1 hour between retries

/**
 * Calculate exponential backoff delay for retries
 */
function calculateRetryDelay(retryCount: number): number {
  // Exponential backoff: 5min, 15min, 30min, 1hr (capped)
  const baseDelay = 5 * 60 * 1000; // 5 minutes
  const delay = baseDelay * 2 ** retryCount;
  return Math.min(delay, MAX_RETRY_DELAY_MS);
}

/**
 * Process scheduled email campaigns that are ready to send
 * This function should be called periodically (e.g., via a cron job or background worker)
 */

// biome-ignore lint/complexity/noExcessiveCognitiveComplexity: this is a valid use case
export async function processScheduledEmailCampaigns(): Promise<void> {
  const now = new Date();

  // Find email campaigns scheduled for now or earlier that haven't been sent yet
  const scheduledCampaigns = await db.query.emailCampaigns.findMany({
    where: and(
      eq(emailCampaigns.status, EmailCampaignStatus.SCHEDULED),
      lte(emailCampaigns.scheduledAt, now)
    ),
  });

  for (const campaign of scheduledCampaigns) {
    try {
      await db
        .update(emailCampaigns)
        .set({ status: EmailCampaignStatus.SENDING })
        .where(eq(emailCampaigns.id, campaign.id));

      const subscribers = await db.query.emailSubscribers.findMany({
        where: eq(emailSubscribers.isActive, true),
      });

      if (subscribers.length === 0) {
        await db
          .update(emailCampaigns)
          .set({
            status: EmailCampaignStatus.FAILED,
            failureReason: "No active subscribers found",
          })
          .where(eq(emailCampaigns.id, campaign.id));
        continue;
      }

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

      const finalStatus =
        result.totalFailed === 0
          ? EmailCampaignStatus.SENT
          : EmailCampaignStatus.FAILED;

      const updateData: Record<string, unknown> = {
        status: finalStatus,
        sentAt: now,
        totalRecipients: subscribers.length,
        totalSent: result.totalSent,
      };

      if (finalStatus === EmailCampaignStatus.FAILED) {
        updateData.failureReason = `Failed to send ${result.totalFailed} out of ${subscribers.length} emails`;
      }

      await db
        .update(emailCampaigns)
        .set(updateData)
        .where(eq(emailCampaigns.id, campaign.id));
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";

      await db
        .update(emailCampaigns)
        .set({
          status: EmailCampaignStatus.FAILED,
          failureReason: errorMessage,
        })
        .where(eq(emailCampaigns.id, campaign.id));
    }
  }
}

/**
 * Retry a failed email campaign
 */
export async function retryEmailCampaign(campaignId: string): Promise<{
  success: boolean;
  message: string;
}> {
  const campaign = await db.query.emailCampaigns.findFirst({
    where: eq(emailCampaigns.id, campaignId),
  });

  if (!campaign) {
    return { success: false, message: "Campaign not found" };
  }

  if (campaign.status !== EmailCampaignStatus.FAILED) {
    return { success: false, message: "Only failed campaigns can be retried" };
  }

  if (campaign.retryCount >= campaign.maxRetries) {
    return {
      success: false,
      message: `Maximum retry limit (${campaign.maxRetries}) reached`,
    };
  }

  // Check if enough time has passed since last retry
  if (campaign.lastRetryAt) {
    const timeSinceLastRetry = Date.now() - campaign.lastRetryAt.getTime();
    const requiredDelay = calculateRetryDelay(campaign.retryCount);

    if (timeSinceLastRetry < requiredDelay) {
      const remainingTime = Math.ceil(
        (requiredDelay - timeSinceLastRetry) / 1000 / 60
      );
      return {
        success: false,
        message: `Please wait ${remainingTime} more minutes before retrying`,
      };
    }
  }

  const now = new Date();

  try {
    // Update retry tracking
    await db
      .update(emailCampaigns)
      .set({
        status: EmailCampaignStatus.SCHEDULED,
        scheduledAt: now,
        retryCount: campaign.retryCount + 1,
        lastRetryAt: now,
        failureReason: null,
      })
      .where(eq(emailCampaigns.id, campaignId));

    // Process the campaign immediately
    await processScheduledEmailCampaigns();

    return {
      success: true,
      message: `Campaign retry initiated (attempt ${campaign.retryCount + 1}/${campaign.maxRetries})`,
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return {
      success: false,
      message: `Failed to retry campaign: ${errorMessage}`,
    };
  }
}
