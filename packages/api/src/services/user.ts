import type { db as DB } from "@acme/db/client";

type DbClient = typeof DB;

export function getAll(db: DbClient) {
  return db.query.user.findMany();
}
