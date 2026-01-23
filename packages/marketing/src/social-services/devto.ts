import type {
  ISocialMediaService,
  SocialMediaPostParams,
  SocialMediaPostResult,
} from "../types";

/**
 * Dev.to Integration Service
 * Publishes articles to the Dev.to blogging platform
 */
export class DevToService implements ISocialMediaService {
  private readonly apiKey: string | null = null;

  constructor() {
    this.apiKey = process.env.DEVTO_API_KEY || null;
  }

  /**
   * Publish an article to Dev.to
   * @param params - Post parameters with content (markdown), metadata should contain title and optional tags
   * @returns Result of the post operation with article ID and URL
   */
  async post(params: SocialMediaPostParams): Promise<SocialMediaPostResult> {
    if (!this.apiKey) {
      return {
        success: false,
        error:
          "Dev.to credentials not configured. Please set DEVTO_API_KEY in your .env file.",
      };
    }

    // Extract title from metadata or use first line of content
    const title =
      (params.metadata?.title as string | undefined) ||
      params.content.split("\n")[0] ||
      "Untitled";
    const tags = (params.metadata?.tags as string[] | undefined) || [];

    if (tags.length > 4) {
      return {
        success: false,
        error: "Dev.to allows a maximum of 4 tags per article",
      };
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10_000);
    try {
      const response = await fetch("https://dev.to/api/articles", {
        method: "POST",
        headers: {
          "api-key": this.apiKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          article: {
            title,
            body_markdown: params.content,
            published: true,
            tags,
          },
        }),
        signal: controller.signal,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Dev.to API error: ${response.status} - ${errorText}`);
      }

      const result = (await response.json()) as { id: number; url: string };

      return {
        success: true,
        postId: result.id.toString(),
        postUrl: result.url || "",
      };
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        return {
          success: false,
          error: "Dev.to request timed out",
        };
      }
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to post to Dev.to",
      };
    } finally {
      clearTimeout(timeoutId);
    }
  }
}
