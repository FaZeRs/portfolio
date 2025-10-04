import { neon } from "@neondatabase/serverless";
import dotenv from "dotenv";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/neon-http";
import { Sitemap } from "tanstack-router-sitemap";

dotenv.config();

// biome-ignore lint/performance/noNamespaceImport: valid import
import * as schema from "../../lib/db/schema";
import { articles } from "../../lib/db/schema/article.schema";
import { Project } from "../../lib/db/schema/project.schema";
import { Service } from "../../lib/db/schema/service.schema";
import { Snippet } from "../../lib/db/schema/snippet.schema";
import { type FileRouteTypes } from "../../routeTree.gen";

export type TRoutes = FileRouteTypes["fullPaths"];

// biome-ignore lint/style/noNonNullAssertion: valid constant
const driver = neon(process.env.DATABASE_URL!);

const db = drizzle({ client: driver, schema, casing: "snake_case" });

export const sitemap: Sitemap<TRoutes> = {
  siteUrl: process.env.VITE_BASE_URL ?? "http://localhost:3000",
  defaultPriority: 0.5,
  routes: {
    "/": { priority: 1, changeFrequency: "daily" },
    "/about": { priority: 1, changeFrequency: "daily" },
    "/projects": { priority: 1, changeFrequency: "daily" },
    "/projects/$projectId": async () => {
      try {
        // Fetch all published projects
        const projects = await db
          .select({ slug: Project.slug, updatedAt: Project.updatedAt })
          .from(Project)
          .where(eq(Project.isDraft, false));

        return projects.map((project) => ({
          path: `/projects/${project.slug}`,
          priority: 0.8,
          changeFrequency: "weekly" as const,
          lastModified: project.updatedAt || new Date(),
        }));
      } catch (_error) {
        return [];
      }
    },
    "/blog": { priority: 1, changeFrequency: "daily" },
    "/blog/$articleId": async () => {
      try {
        // Fetch all published articles
        const publishedArticles = await db
          .select({ slug: articles.slug, updatedAt: articles.updatedAt })
          .from(articles)
          .where(eq(articles.isDraft, false));

        return publishedArticles.map((article) => ({
          path: `/blog/${article.slug}`,
          priority: 0.8,
          changeFrequency: "weekly" as const,
          lastModified: article.updatedAt || new Date(),
        }));
      } catch (_error) {
        return [];
      }
    },
    "/bookmarks": { priority: 1, changeFrequency: "daily" },
    "/stats": { priority: 1, changeFrequency: "daily" },
    "/snippets": { priority: 1, changeFrequency: "daily" },
    "/snippets/$snippetId": async () => {
      try {
        // Fetch all published snippets
        const snippets = await db
          .select({ slug: Snippet.slug, updatedAt: Snippet.updatedAt })
          .from(Snippet)
          .where(eq(Snippet.isDraft, false));

        return snippets.map((snippet) => ({
          path: `/snippets/${snippet.slug}`,
          priority: 0.7,
          changeFrequency: "monthly" as const,
          lastModified: snippet.updatedAt || new Date(),
        }));
      } catch (_error) {
        return [];
      }
    },
    "/uses": { priority: 1, changeFrequency: "daily" },
    "/guestbook": { priority: 1, changeFrequency: "daily" },
    "/services/$serviceId": async () => {
      try {
        // Fetch all published projects
        const services = await db
          .select({ slug: Service.slug, updatedAt: Service.updatedAt })
          .from(Service)
          .where(eq(Service.isDraft, false));

        return services.map((service) => ({
          path: `/services/${service.slug}`,
          priority: 0.8,
          changeFrequency: "weekly" as const,
          lastModified: service.updatedAt || new Date(),
        }));
      } catch (_error) {
        return [];
      }
    },
  },
};

export default sitemap;
