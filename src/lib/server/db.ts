import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

import * as schema from "./schema";

const driver = neon(process.env.DATABASE_URL as string);
export const db = drizzle({ client: driver, schema, casing: "snake_case" });
