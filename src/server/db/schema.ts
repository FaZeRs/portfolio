import { relations, sql } from "drizzle-orm";
import {
  index,
  int,
  mysqlTable,
  primaryKey,
  text,
  timestamp,
  varchar,
  serial,
  date,
  boolean,
  mysqlEnum,
} from "drizzle-orm/mysql-core";
import { type AdapterAccount } from "next-auth/adapters";

export const experiences = mysqlTable("experiences", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  organization: text("organization"),
  description: text("description"),
  website: text("website"),
  startDate: date("startDate").notNull(),
  endDate: date("endDate"),
  onGoing: boolean("onGoing").default(false),
  logoUrl: text("logoUrl"),
  published: boolean("published").default(false),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Experience = typeof experiences.$inferSelect;

export const links = mysqlTable("links", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  url: text("url").notNull(),
  icon: text("icon"),
  published: boolean("published").default(false),
  projectId: int("projectId"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const linksRelations = relations(links, ({ one }) => ({
  project: one(projects, {
    fields: [links.projectId],
    references: [projects.id],
  }),
}));

export type Link = typeof links.$inferSelect;

export const projects = mysqlTable("projects", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  shortDescription: text("shortDescription"),
  description: text("description"),
  status: mysqlEnum("status", [
    "unknown",
    "open",
    "scheduled",
    "in_development",
    "canceled",
    "completed",
  ]).default("unknown"),
  published: boolean("published").default(false),
  thumbnailUrl: text("thumbnailUrl"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const projectsRelations = relations(projects, ({ many }) => ({
  links: many(links),
  tags: many(tags),
}));

export type Project = typeof projects.$inferSelect;

export const tags = mysqlTable("tags", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  published: boolean("published").default(false),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const tagsRelations = relations(tags, ({ many }) => ({
  projects: many(projects),
}));

export type Tag = typeof tags.$inferSelect;

export const users = mysqlTable("user", {
  id: varchar("id", { length: 255 }).notNull().primaryKey(),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 255 }).notNull(),
  emailVerified: timestamp("emailVerified", {
    mode: "date",
    fsp: 3,
  }).default(sql`CURRENT_TIMESTAMP(3)`),
  image: varchar("image", { length: 255 }),
});

export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
}));

export const accounts = mysqlTable(
  "account",
  {
    userId: varchar("userId", { length: 255 }).notNull(),
    type: varchar("type", { length: 255 })
      .$type<AdapterAccount["type"]>()
      .notNull(),
    provider: varchar("provider", { length: 255 }).notNull(),
    providerAccountId: varchar("providerAccountId", { length: 255 }).notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: int("expires_at"),
    token_type: varchar("token_type", { length: 255 }),
    scope: varchar("scope", { length: 255 }),
    id_token: text("id_token"),
    session_state: varchar("session_state", { length: 255 }),
  },
  (account) => ({
    compoundKey: primaryKey(account.provider, account.providerAccountId),
    userIdIdx: index("userId_idx").on(account.userId),
  }),
);

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, { fields: [accounts.userId], references: [users.id] }),
}));

export const sessions = mysqlTable(
  "session",
  {
    sessionToken: varchar("sessionToken", { length: 255 })
      .notNull()
      .primaryKey(),
    userId: varchar("userId", { length: 255 }).notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (session) => ({
    userIdIdx: index("userId_idx").on(session.userId),
  }),
);

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}));

export const verificationTokens = mysqlTable(
  "verificationToken",
  {
    identifier: varchar("identifier", { length: 255 }).notNull(),
    token: varchar("token", { length: 255 }).notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey(vt.identifier, vt.token),
  }),
);
