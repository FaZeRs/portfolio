import { createServerOnlyFn } from "@tanstack/react-start";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { admin } from "better-auth/plugins";
import { reactStartCookies } from "better-auth/react-start";
import { db } from "~/lib/db";
import { env } from "~/lib/env/server";
import { getBaseUrl } from "~/lib/utils";

// biome-ignore lint/style/noMagicNumbers: valid constant
const MAX_AGE = 5 * 60; // 5 minutes

const getAuthConfig = createServerOnlyFn(() =>
  betterAuth({
    baseURL: env.BETTER_AUTH_URL ?? getBaseUrl(),
    secret: env.BETTER_AUTH_SECRET,
    telemetry: {
      enabled: false,
    },
    database: drizzleAdapter(db, {
      provider: "pg",
    }),

    // https://www.better-auth.com/docs/integrations/tanstack#usage-tips
    plugins: [admin(), reactStartCookies()],

    // https://www.better-auth.com/docs/concepts/session-management#session-caching
    session: {
      cookieCache: {
        enabled: true,
        maxAge: MAX_AGE,
      },
    },

    // https://www.better-auth.com/docs/concepts/oauth
    socialProviders: {
      ...(env.GITHUB_CLIENT_ID &&
        env.GITHUB_CLIENT_SECRET && {
          github: {
            clientId: env.GITHUB_CLIENT_ID,
            clientSecret: env.GITHUB_CLIENT_SECRET,
          },
        }),
      ...(env.TWITTER_CLIENT_ID &&
        env.TWITTER_CLIENT_SECRET && {
          twitter: {
            clientId: env.TWITTER_CLIENT_ID,
            clientSecret: env.TWITTER_CLIENT_SECRET,
          },
        }),
      ...(env.GOOGLE_CLIENT_ID &&
        env.GOOGLE_CLIENT_SECRET && {
          google: {
            clientId: env.GOOGLE_CLIENT_ID,
            clientSecret: env.GOOGLE_CLIENT_SECRET,
            prompt: "select_account consent",
          },
        }),
      ...(env.FACEBOOK_CLIENT_ID &&
        env.FACEBOOK_CLIENT_SECRET && {
          facebook: {
            clientId: env.FACEBOOK_CLIENT_ID,
            clientSecret: env.FACEBOOK_CLIENT_SECRET,
          },
        }),
    },

    trustedOrigins: [getBaseUrl()],

    // https://www.better-auth.com/docs/authentication/email-password
    // emailAndPassword: {
    //   enabled: true,
    // },

    user: {
      deleteUser: {
        enabled: true,
      },
      additionalFields: {
        twitterHandle: {
          type: "string",
          required: false,
        },
      },
    },
  })
);

export const auth = getAuthConfig();
