/** biome-ignore-all lint/performance/noBarrelFile: this is a barrel file */

export {
  processScheduledSocialPosts,
  retrySocialPost,
} from "../../marketing/src/post-scheduler";
export type { SocialPlatformType } from "../../marketing/src/social-services";
export {
  processScheduledEmailCampaigns,
  retryEmailCampaign,
} from "./campaign-scheduler";
export { EmailMarketingService, emailMarketingService } from "./email-service";
export { NewContentEmail } from "./email-templates/new-content";
export { NewsletterEmail } from "./email-templates/newsletter";
export {
  DevToService,
  FacebookService,
  getSocialMediaService,
  LinkedInService,
  TwitterService,
} from "./social-services";
export type {
  ISocialMediaService,
  SocialMediaMetrics,
  SocialMediaPostParams,
  SocialMediaPostResult,
} from "./types";
export {
  generateUnsubscribeToken,
  isValidUnsubscribeToken,
  verifyUnsubscribeToken,
} from "./unsubscribe-token";
