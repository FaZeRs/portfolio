import type {
  ISocialMediaService,
  SocialMediaPostParams,
  SocialMediaPostResult,
} from "../types";

/**
 * LinkedIn Integration Service
 * Posts updates to LinkedIn personal or company pages
 */
export class LinkedInService implements ISocialMediaService {
  private readonly accessToken: string | null = null;

  constructor() {
    this.accessToken = process.env.LINKEDIN_ACCESS_TOKEN || null;
  }

  /**
   * Post an update to LinkedIn
   * @param params - Post parameters with content and optional media (will be uploaded to LinkedIn)
   * @returns Result of the post operation with post ID and URL
   */
  async post(params: SocialMediaPostParams): Promise<SocialMediaPostResult> {
    if (!this.accessToken) {
      return {
        success: false,
        error:
          "LinkedIn credentials not configured. Please set LINKEDIN_ACCESS_TOKEN in your .env file.",
      };
    }

    try {
      const personId = await this.getPersonId();
      const authorUrn = `urn:li:person:${personId}`;

      const mediaAssets =
        params.mediaUrls && params.mediaUrls.length > 0
          ? await this.uploadMedia(authorUrn, params.mediaUrls)
          : undefined;

      const postData = {
        author: authorUrn,
        lifecycleState: "PUBLISHED",
        specificContent: {
          "com.linkedin.ugc.ShareContent": {
            shareCommentary: {
              text: params.content,
            },
            shareMediaCategory: mediaAssets ? "IMAGE" : "NONE",
            ...(mediaAssets && { media: mediaAssets }),
          },
        },
        visibility: {
          "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC",
        },
      };

      const response = await fetch("https://api.linkedin.com/v2/ugcPosts", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
          "Content-Type": "application/json",
          "X-Restli-Protocol-Version": "2.0.0",
        },
        body: JSON.stringify(postData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `LinkedIn API error: ${response.status} - ${errorText}`
        );
      }

      const result = (await response.json()) as { id: string };

      return {
        success: true,
        postId: result.id,
        postUrl: `https://www.linkedin.com/feed/update/${result.id}`,
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to post to LinkedIn",
      };
    }
  }

  /**
   * Upload media to LinkedIn
   * @param authorUrn - The author URN
   * @param mediaUrls - Array of media URLs to upload
   * @returns Array of media asset references
   * @private
   */
  private async uploadMedia(
    authorUrn: string,
    mediaUrls: string[]
  ): Promise<Array<{ media: string }>> {
    const mediaAssets: Array<{ media: string }> = [];

    for (const url of mediaUrls) {
      const asset = await this.uploadSingleMedia(authorUrn, url);
      mediaAssets.push({ media: asset });
    }

    return mediaAssets;
  }

  /**
   * Upload a single media file to LinkedIn
   * @param authorUrn - The author URN
   * @param url - The media URL to upload
   * @returns The asset URN
   * @private
   */
  private async uploadSingleMedia(
    authorUrn: string,
    url: string
  ): Promise<string> {
    const registerResponse = await fetch(
      "https://api.linkedin.com/v2/assets?action=registerUpload",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          registerUploadRequest: {
            recipes: ["urn:li:digitalmediaRecipe:feedshare-image"],
            owner: authorUrn,
            serviceRelationships: [
              {
                relationshipType: "OWNER",
                identifier: "urn:li:userGeneratedContent",
              },
            ],
          },
        }),
      }
    );

    if (!registerResponse.ok) {
      throw new Error(
        `Failed to register media upload: ${registerResponse.status}`
      );
    }

    const registerData = (await registerResponse.json()) as {
      value: {
        uploadMechanism: {
          "com.linkedin.digitalmedia.uploading.MediaUploadHttpRequest": {
            uploadUrl: string;
          };
        };
        asset: string;
      };
    };
    const uploadUrl =
      registerData.value.uploadMechanism[
        "com.linkedin.digitalmedia.uploading.MediaUploadHttpRequest"
      ].uploadUrl;
    const asset = registerData.value.asset;

    const imageResponse = await fetch(url);
    const imageBuffer = await imageResponse.arrayBuffer();

    const uploadResponse = await fetch(uploadUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
      },
      body: imageBuffer,
    });

    if (!uploadResponse.ok) {
      throw new Error(`Failed to upload media: ${uploadResponse.status}`);
    }

    return asset;
  }

  /**
   * Get the LinkedIn person ID for the authenticated user
   * @returns The LinkedIn person ID
   * @private
   */
  private async getPersonId(): Promise<string> {
    const response = await fetch("https://api.linkedin.com/v2/me", {
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to get LinkedIn person ID");
    }

    const data = (await response.json()) as { id: string };
    return data.id;
  }
}
