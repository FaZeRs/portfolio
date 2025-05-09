import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { env } from "~/lib/env.server";
import * as schema from "./schema";

const driver = neon(env.DATABASE_URL);
export const db = drizzle({ client: driver, schema, casing: "snake_case" });
