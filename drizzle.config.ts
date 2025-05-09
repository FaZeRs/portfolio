import type { Config } from "drizzle-kit";
import { env } from "~/lib/env.server";

export default {
  out: "./drizzle",
  schema: "./src/lib/server/schema/index.ts",
  breakpoints: true,
  verbose: true,
  strict: true,
  dialect: "postgresql",
  casing: "snake_case",
  dbCredentials: {
    url: env.DATABASE_URL,
  },
} satisfies Config;
