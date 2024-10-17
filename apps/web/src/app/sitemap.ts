import type { MetadataRoute } from "next";

import { projectsData } from "~/constants/projects-data";
import { baseUrl } from "../constants";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes: MetadataRoute.Sitemap = [
    "",
    "/about",
    "/projects",
    ...projectsData.map((project) => `/projects/${project.slug}`),
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString().split("T")[0],
  }));

  return [...routes];
}
