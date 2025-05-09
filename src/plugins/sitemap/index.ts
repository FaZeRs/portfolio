import { eq } from "drizzle-orm";
import { Sitemap } from "tanstack-router-sitemap";
import { db } from "~/lib/server/db";
import { Project } from "~/lib/server/schema";
import { type FileRouteTypes } from "~/routeTree.gen";

export type TRoutes = FileRouteTypes["fullPaths"];

export const sitemap: Sitemap<TRoutes> = {
  siteUrl: "https://naurislinde.dev",
  defaultPriority: 0.5,
  routes: {
    "/": { priority: 1, changeFrequency: "daily" },
    "/about": { priority: 1, changeFrequency: "daily" },
    "/projects": { priority: 1, changeFrequency: "daily" },
    "/projects/$projectId": async () => {
      const projects = await db.query.Project.findMany({
        where: eq(Project.isDraft, false),
      });

      return projects.map((project) => ({
        path: `/projects/${project.slug}`,
        priority: 0.8,
        changeFrequency: "daily",
      }));
    },
  },
};

export default sitemap;
