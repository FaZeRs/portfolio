import type {
  ISocialMediaService,
  SocialMediaPostParams,
  SocialMediaPostResult,
} from "../types";

/**
 * Facebook Integration Service
 * Posts updates to Facebook pages
 */
export class FacebookService implements ISocialMediaService {
  private readonly accessToken: string | null = null;
  private readonly pageId: string | null = null;

  constructor() {
    this.accessToken = process.env.FACEBOOK_ACCESS_TOKEN || null;
    this.pageId = process.env.FACEBOOK_PAGE_ID || null;
  }

  /**
   * Post an update to a Facebook page
   * @param params - Post parameters with content and optional media (only first URL is used)
   * @returns Result of the post operation with post ID and URL
   */
  async post(params: SocialMediaPostParams): Promise<SocialMediaPostResult> {
    if (!(this.accessToken && this.pageId)) {
      return {
        success: false,
        error:
          "Facebook credentials not configured. Please set FACEBOOK_ACCESS_TOKEN and FACEBOOK_PAGE_ID in your .env file.",
      };
    }

    try {
      const url = `https://graph.facebook.com/v18.0/${this.pageId}/feed`;
      const searchParams = new URLSearchParams({
        message: params.content,
        access_token: this.accessToken,
      });

      if (params.mediaUrls && params.mediaUrls.length > 0) {
        searchParams.append("link", params.mediaUrls[0] || "");
      }

      const response = await fetch(url, {
        method: "POST",
        body: searchParams,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Facebook API error: ${response.status} - ${errorText}`
        );
      }

      const result = (await response.json()) as { id: string };

      return {
        success: true,
        postId: result.id,
        postUrl: `https://www.facebook.com/${result.id}`,
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to post to Facebook",
      };
    }
  }
}
