export const queryKeys = {
  blog: {
    all: ["blog"] as const,
    lists: () => [...queryKeys.blog.all, "list"] as const,
    listAll: () => [...queryKeys.blog.lists(), "all"] as const,
    byId: (id: string) => [...queryKeys.blog.all, "byId", id] as const,
  },
  project: {
    all: ["project"] as const,
    lists: () => [...queryKeys.project.all, "list"] as const,
    listAll: () => [...queryKeys.project.lists(), "all"] as const,
    byId: (id: string) => [...queryKeys.project.all, "byId", id] as const,
  },
  snippet: {
    all: ["snippet"] as const,
    lists: () => [...queryKeys.snippet.all, "list"] as const,
    listAll: () => [...queryKeys.snippet.lists(), "all"] as const,
    byId: (id: string) => [...queryKeys.snippet.all, "byId", id] as const,
  },
  service: {
    all: ["service"] as const,
    lists: () => [...queryKeys.service.all, "list"] as const,
    listAll: () => [...queryKeys.service.lists(), "all"] as const,
    byId: (id: string) => [...queryKeys.service.all, "byId", id] as const,
  },
  experience: {
    all: ["experience"] as const,
    lists: () => [...queryKeys.experience.all, "list"] as const,
    listAll: () => [...queryKeys.experience.lists(), "all"] as const,
    byId: (id: string) => [...queryKeys.experience.all, "byId", id] as const,
  },
  stats: {
    all: ["stats"] as const,
    monthlyUsers: (months?: number) =>
      [...queryKeys.stats.all, "monthlyUsers", months ?? 6] as const,
    monthlyBlogViews: (months?: number) =>
      [...queryKeys.stats.all, "monthlyBlogViews", months ?? 6] as const,
  },
  user: {
    all: ["user"] as const,
    list: () => [...queryKeys.user.all, "list"] as const,
  },
} as const;
