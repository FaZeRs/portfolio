import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import { env } from "~/env";
import * as schema from "./schema";

const driver = postgres(env.DATABASE_URL as string);
export const db = drizzle({ client: driver, schema, casing: "snake_case" });
