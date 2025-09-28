import { neon } from "@neondatabase/serverless";
import { createServerOnlyFn } from "@tanstack/react-start";
import { upstashCache } from "drizzle-orm/cache/upstash";
import { drizzle } from "drizzle-orm/neon-http";
import { env } from "~/lib/env/server";
// biome-ignore lint/performance/noNamespaceImport: valid import
import * as schema from "./schema";

const driver = neon(env.DATABASE_URL);

const cache = upstashCache({
  url: env.KV_REST_API_URL,
  token: env.KV_REST_API_TOKEN,
  global: true,
  config: { ex: 60 },
});

const getDatabase = createServerOnlyFn(() =>
  drizzle({
    client: driver,
    schema,
    casing: "snake_case",
    cache,
  })
);

export const db = getDatabase();
