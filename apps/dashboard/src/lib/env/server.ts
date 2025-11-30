import { apiEnv } from "@acme/api/env";
import { authEnv } from "@acme/auth/env";
import { dbEnv } from "@acme/db/env";
import { createEnv } from "@t3-oss/env-core";
import { vercel } from "@t3-oss/env-core/presets-zod";
import { z } from "zod/v4";

export const env = createEnv({
  extends: [authEnv(), dbEnv(), apiEnv(), vercel()],
  shared: {
    NODE_ENV: z
      .enum(["development", "production", "test"])
      .default("development"),
  },
  server: {
    SENTRY_AUTH_TOKEN: z.string().optional(),
    SENTRY_ORG: z.string().optional(),
    SENTRY_PROJECT: z.string().optional(),
    BLOB_READ_WRITE_TOKEN: z.string().optional(),
    OPENAI_API_KEY: z.string().min(1).optional(),
  },
  clientPrefix: "VITE_",
  client: {
    VITE_SENTRY_DSN: z.string().min(1).optional(),
  },
  runtimeEnv: process.env,
  emptyStringAsUndefined: true,
  skipValidation:
    !!process.env.CI || process.env.npm_lifecycle_event === "lint",
});
