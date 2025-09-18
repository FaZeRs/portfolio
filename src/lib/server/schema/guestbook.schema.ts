import { relations } from "drizzle-orm";
import { pgTable } from "drizzle-orm/pg-core";
import { user } from "./auth.schema";

export const guestbook = pgTable("guestbook", (t) => ({
  id: t.uuid().notNull().primaryKey().defaultRandom(),
  userId: t
    .text()
    .references(() => user.id, { onDelete: "cascade" })
    .notNull(),
  message: t.text().notNull(),
  createdAt: t.timestamp().defaultNow().notNull(),
  updatedAt: t.timestamp().defaultNow().notNull(),
}));

export const guestbookRelations = relations(guestbook, (t) => ({
  user: t.one(user, {
    fields: [guestbook.userId],
    references: [user.id],
  }),
}));
