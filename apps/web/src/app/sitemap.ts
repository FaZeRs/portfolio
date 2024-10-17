import type { MetadataRoute } from "next";

import { getBaseUrl } from "~/constants";
import { projectsData } from "~/constants/projects-data";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes: MetadataRoute.Sitemap = [
    "",
    "/about",
    "/projects",
    ...projectsData.map((project) => `/projects/${project.slug}`),
  ].map((route) => ({
    url: `${getBaseUrl()}${route}`,
    lastModified: new Date().toISOString().split("T")[0],
  }));

  return [...routes];
}
