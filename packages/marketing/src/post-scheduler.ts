import { db } from "@acme/db/client";
import { SocialPostStatus, socialMediaPosts } from "@acme/db/schema";
import { and, eq, lte } from "drizzle-orm";
import { getSocialMediaService } from "./social-services/factory";

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
 * Process scheduled social media posts that are ready to publish
 * This function should be called periodically (e.g., via a cron job or background worker)
 */
export async function processScheduledSocialPosts(): Promise<void> {
  const now = new Date();

  // Find posts scheduled for now or earlier that haven't been published yet
  const scheduledPosts = await db.query.socialMediaPosts.findMany({
    where: and(
      eq(socialMediaPosts.status, SocialPostStatus.SCHEDULED),
      lte(socialMediaPosts.scheduledAt, now)
    ),
  });

  for (const post of scheduledPosts) {
    try {
      // Update status to publishing
      await db
        .update(socialMediaPosts)
        .set({ status: SocialPostStatus.PUBLISHING })
        .where(eq(socialMediaPosts.id, post.id));

      // Get the appropriate service and post
      const service = getSocialMediaService(post.platform);
      const result = await service.post({
        content: post.content,
        mediaUrls: post.mediaUrls || undefined,
      });

      if (result.success) {
        // Update post as published
        await db
          .update(socialMediaPosts)
          .set({
            status: SocialPostStatus.PUBLISHED,
            publishedAt: now,
            externalPostId: result.postId,
            postUrl: result.postUrl,
            failureReason: null,
          })
          .where(eq(socialMediaPosts.id, post.id));
      } else {
        // Mark as failed
        await db
          .update(socialMediaPosts)
          .set({
            status: SocialPostStatus.FAILED,
            failureReason: result.error || "Unknown error occurred",
          })
          .where(eq(socialMediaPosts.id, post.id));
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";

      await db
        .update(socialMediaPosts)
        .set({
          status: SocialPostStatus.FAILED,
          failureReason: errorMessage,
        })
        .where(eq(socialMediaPosts.id, post.id));
    }
  }
}

/**
 * Retry a failed social media post
 */
export async function retrySocialPost(postId: string): Promise<{
  success: boolean;
  message: string;
}> {
  const post = await db.query.socialMediaPosts.findFirst({
    where: eq(socialMediaPosts.id, postId),
  });

  if (!post) {
    return { success: false, message: "Post not found" };
  }

  if (post.status !== SocialPostStatus.FAILED) {
    return { success: false, message: "Only failed posts can be retried" };
  }

  if (post.retryCount >= post.maxRetries) {
    return {
      success: false,
      message: `Maximum retry limit (${post.maxRetries}) reached`,
    };
  }

  // Check if enough time has passed since last retry
  if (post.lastRetryAt) {
    const timeSinceLastRetry = Date.now() - post.lastRetryAt.getTime();
    const requiredDelay = calculateRetryDelay(post.retryCount);

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
    // Update retry tracking and schedule for immediate processing
    await db
      .update(socialMediaPosts)
      .set({
        status: SocialPostStatus.SCHEDULED,
        scheduledAt: now,
        retryCount: post.retryCount + 1,
        lastRetryAt: now,
        failureReason: null,
      })
      .where(eq(socialMediaPosts.id, postId));

    // Process the post immediately
    await processScheduledSocialPosts();

    return {
      success: true,
      message: `Post retry initiated (attempt ${post.retryCount + 1}/${post.maxRetries})`,
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return {
      success: false,
      message: `Failed to retry post: ${errorMessage}`,
    };
  }
}
