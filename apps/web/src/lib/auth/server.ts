import { initAuth } from "@acme/auth";
import { tanstackStartCookies } from "better-auth/tanstack-start";
import { env } from "~/lib/env/server";
import { getBaseUrl } from "~/lib/utils";

export const auth = initAuth({
  baseUrl: getBaseUrl(),
  productionUrl: getBaseUrl(),
  secret: env.BETTER_AUTH_SECRET,
  githubClientId: env.GITHUB_CLIENT_ID,
  githubClientSecret: env.GITHUB_CLIENT_SECRET,
  twitterClientId: env.TWITTER_CLIENT_ID,
  twitterClientSecret: env.TWITTER_CLIENT_SECRET,
  googleClientId: env.GOOGLE_CLIENT_ID,
  googleClientSecret: env.GOOGLE_CLIENT_SECRET,
  facebookClientId: env.FACEBOOK_CLIENT_ID,
  facebookClientSecret: env.FACEBOOK_CLIENT_SECRET,

  extraPlugins: [tanstackStartCookies()],
});
