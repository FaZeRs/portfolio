import { Sitemap } from "tanstack-router-sitemap";
import { type FileRouteTypes } from "../../routeTree.gen";

export type TRoutes = FileRouteTypes["fullPaths"];

export const sitemap: Sitemap<TRoutes> = {
  siteUrl: "https://naurislinde.dev",
  defaultPriority: 0.5,
  routes: {
    "/": { priority: 1, changeFrequency: "daily" },
    "/about": { priority: 1, changeFrequency: "daily" },
    "/projects": { priority: 1, changeFrequency: "daily" },
  },
};

export default sitemap;
