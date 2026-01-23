import { db } from "@acme/db/client";
import type { BetterAuthOptions, BetterAuthPlugin } from "better-auth";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { admin, oAuthProxy } from "better-auth/plugins";

export function initAuth<
  TExtraPlugins extends BetterAuthPlugin[] = [],
>(options: {
  baseUrl: string;
  productionUrl: string;
  secret: string | undefined;
  trustedOrigins?: string[];

  githubClientId?: string;
  githubClientSecret?: string;
  twitterClientId?: string;
  twitterClientSecret?: string;
  googleClientId?: string;
  googleClientSecret?: string;
  facebookClientId?: string;
  facebookClientSecret?: string;

  extraPlugins?: TExtraPlugins;
}) {
  const config = {
    database: drizzleAdapter(db, {
      provider: "pg",
    }),
    baseURL: options.baseUrl,
    secret: options.secret,
    trustedOrigins: options.trustedOrigins,
    telemetry: {
      enabled: false,
    },
    plugins: [
      oAuthProxy({
        productionURL: options.productionUrl,
      }),
      admin(),
      ...(options.extraPlugins ?? []),
    ],
    socialProviders: {
      ...(options.githubClientId &&
        options.githubClientSecret && {
          github: {
            clientId: options.githubClientId,
            clientSecret: options.githubClientSecret,
            redirectURI: `${options.productionUrl}/api/auth/callback/github`,
          },
        }),
      ...(options.twitterClientId &&
        options.twitterClientSecret && {
          twitter: {
            clientId: options.twitterClientId,
            clientSecret: options.twitterClientSecret,
            redirectURI: `${options.productionUrl}/api/auth/callback/twitter`,
          },
        }),
      ...(options.googleClientId &&
        options.googleClientSecret && {
          google: {
            clientId: options.googleClientId,
            clientSecret: options.googleClientSecret,
            prompt: "select_account consent",
            redirectURI: `${options.productionUrl}/api/auth/callback/google`,
          },
        }),
      ...(options.facebookClientId &&
        options.facebookClientSecret && {
          facebook: {
            clientId: options.facebookClientId,
            clientSecret: options.facebookClientSecret,
            redirectURI: `${options.productionUrl}/api/auth/callback/facebook`,
          },
        }),
    },
    onAPIError: {
      onError(error, ctx) {
        console.error("BETTER AUTH API ERROR", error, ctx);
      },
    },
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
  } satisfies BetterAuthOptions;

  return betterAuth(config);
}

export type Auth = ReturnType<typeof initAuth>;
export type Session = Auth["$Infer"]["Session"];
