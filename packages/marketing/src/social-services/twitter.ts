import { TwitterApi } from "twitter-api-v2";
import type {
  ISocialMediaService,
  SocialMediaMetrics,
  SocialMediaPostParams,
  SocialMediaPostResult,
} from "../types";

/**
 * Twitter/X Integration Service
 * Posts tweets with optional media attachments and retrieves engagement metrics
 */
export class TwitterService implements ISocialMediaService {
  private readonly client: TwitterApi | null = null;

  constructor() {
    const appKey = process.env.TWITTER_API_KEY;
    const appSecret = process.env.TWITTER_API_SECRET;
    const accessToken = process.env.TWITTER_ACCESS_TOKEN;
    const accessSecret = process.env.TWITTER_ACCESS_SECRET;

    if (appKey && appSecret && accessToken && accessSecret) {
      this.client = new TwitterApi({
        appKey,
        appSecret,
        accessToken,
        accessSecret,
      });
    }
  }

  /**
   * Post a tweet to Twitter/X
   * @param params - Post parameters with content (max 280 characters) and optional media (max 4 images)
   * @returns Result of the post operation with tweet ID and URL
   */
  async post(params: SocialMediaPostParams): Promise<SocialMediaPostResult> {
    if (!this.client) {
      return {
        success: false,
        error:
          "Twitter credentials not configured. Please set TWITTER_API_KEY, TWITTER_API_SECRET, TWITTER_ACCESS_TOKEN, and TWITTER_ACCESS_SECRET in your .env file.",
      };
    }

    if (params.content.length > 280) {
      return {
        success: false,
        error: "Tweet content exceeds 280 character limit",
      };
    }

    if (params.mediaUrls && params.mediaUrls.length > 4) {
      return {
        success: false,
        error: "Twitter allows a maximum of 4 media attachments per tweet",
      };
    }

    try {
      let mediaIds: string[] | undefined;

      if (params.mediaUrls && params.mediaUrls.length > 0) {
        mediaIds = await Promise.all(
          params.mediaUrls.map(async (url) => {
            const response = await fetch(url);
            const buffer = await response.arrayBuffer();
            const bufferData = Buffer.from(buffer);
            // biome-ignore lint/style/noNonNullAssertion: this is a valid use case
            return await this.client!.v1.uploadMedia(bufferData, {
              mimeType: response.headers.get("content-type") || "image/jpeg",
            });
          })
        );
      }

      const tweet = await this.client.v2.tweet(
        params.content,
        mediaIds
          ? {
              media: {
                media_ids: mediaIds.slice(0, 4) as
                  | [string]
                  | [string, string]
                  | [string, string, string]
                  | [string, string, string, string],
              },
            }
          : undefined
      );

      return {
        success: true,
        postId: tweet.data.id,
        postUrl: `https://twitter.com/i/web/status/${tweet.data.id}`,
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to post to Twitter",
      };
    }
  }

  /**
   * Get engagement metrics for a tweet
   * @param tweetId - The ID of the tweet
   * @returns Engagement metrics including likes, shares, comments, and impressions
   */
  async getMetrics(tweetId: string): Promise<SocialMediaMetrics> {
    if (!this.client) {
      throw new Error("Twitter credentials not configured");
    }

    try {
      const tweet = await this.client.v2.singleTweet(tweetId, {
        "tweet.fields": ["public_metrics"],
      });

      return {
        likes: tweet.data.public_metrics?.like_count || 0,
        shares: tweet.data.public_metrics?.retweet_count || 0,
        comments: tweet.data.public_metrics?.reply_count || 0,
        impressions: tweet.data.public_metrics?.impression_count || 0,
      };
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? error.message
          : "Failed to fetch Twitter metrics"
      );
    }
  }
}
