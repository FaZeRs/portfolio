import { type FileRouteTypes } from "~/routeTree.gen";
import { projectsData } from "../../lib/constants/projects-data";
import { type Sitemap } from "./types";

export type TRoutes = FileRouteTypes["fullPaths"];

export const sitemap: Sitemap<TRoutes> = {
  siteUrl: "https://naurislinde.dev",
  defaultPriority: 0.5,
  routes: {
    "/": { priority: 1, changeFrequency: "daily" },
    "/about": { priority: 1, changeFrequency: "daily" },
    "/projects": { priority: 1, changeFrequency: "daily" },
    "/projects/$projectId": async () => {
      const projects = projectsData;

      return projects.map((project) => ({
        path: `/projects/${project.slug}`,
        priority: 0.8,
        changeFrequency: "daily",
      }));
    },
  },
};

export default sitemap;
