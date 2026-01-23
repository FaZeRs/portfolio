export type SocialMediaPostResult = {
  success: boolean;
  postId?: string;
  postUrl?: string;
  error?: string;
};

export type SocialMediaMetrics = {
  likes: number;
  shares: number;
  comments: number;
  impressions: number;
};

/**
 * Parameters for posting to social media
 */
export type SocialMediaPostParams = {
  content: string;
  mediaUrls?: string[];
  /** Additional platform-specific metadata */
  metadata?: Record<string, unknown>;
};

/**
 * Base type for social media service implementations
 */
export type ISocialMediaService = {
  /**
   * Post content to the social media platform
   * @param params - Post parameters
   * @returns Result of the post operation
   */
  post(params: SocialMediaPostParams): Promise<SocialMediaPostResult>;

  /**
   * Get engagement metrics for a post (if supported by the platform)
   * @param postId - The ID of the post
   * @returns Metrics for the post
   */
  getMetrics?(postId: string): Promise<SocialMediaMetrics>;
};
