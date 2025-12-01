import { createEnv } from "@t3-oss/env-core";
import { z } from "zod/v4";

export const env = createEnv({
  shared: {
    NODE_ENV: z
      .enum(["development", "production", "test"])
      .default("development"),
  },
  server: {},
  clientPrefix: "VITE_",
  client: {
    VITE_APP_URL: z.url().optional(),
    VITE_APP_TITLE: z.string().min(1).optional(),
    VITE_SENTRY_DSN: z.string().min(1).optional(),
  },
  runtimeEnv: import.meta.env,
  emptyStringAsUndefined: true,
  skipValidation:
    !!process.env.CI || process.env.npm_lifecycle_event === "lint",
});
