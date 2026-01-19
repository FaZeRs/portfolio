import type { ISocialMediaService } from "../types";
import { DevToService } from "./devto";
import { FacebookService } from "./facebook";
import { LinkedInService } from "./linkedin";
import { TwitterService } from "./twitter";

export type SocialPlatformType = "twitter" | "linkedin" | "facebook" | "devto";

/**
 * Factory function to get the appropriate social media service
 * @param platform - The social media platform identifier
 * @returns An instance of the requested social media service
 * @throws Error if the platform is not supported
 */
export function getSocialMediaService(
  platform: SocialPlatformType
): ISocialMediaService {
  switch (platform) {
    case "twitter":
      return new TwitterService();
    case "linkedin":
      return new LinkedInService();
    case "facebook":
      return new FacebookService();
    case "devto":
      return new DevToService();
    default:
      throw new Error(`Unsupported platform: ${platform}`);
  }
}
