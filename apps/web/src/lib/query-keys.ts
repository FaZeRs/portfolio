export const queryKeys = {
  blog: {
    all: ["blog"] as const,
    lists: () => [...queryKeys.blog.all, "list"] as const,
    listPublic: () => [...queryKeys.blog.lists(), "public"] as const,
    listAll: () => [...queryKeys.blog.lists(), "all"] as const,
    details: () => [...queryKeys.blog.all, "detail"] as const,
    detail: (slug: string) => [...queryKeys.blog.details(), slug] as const,
    byId: (id: string) => [...queryKeys.blog.all, "byId", id] as const,
    isLiked: (slug: string) =>
      [...queryKeys.blog.all, "isLiked", slug] as const,
  },
  comment: {
    all: ["comment"] as const,
    byArticle: (articleId: string) =>
      [...queryKeys.comment.all, "byArticle", articleId] as const,
    byArticleAndParent: (articleId: string, parentId?: string) =>
      [
        ...queryKeys.comment.all,
        "byArticle",
        articleId,
        "parent",
        parentId ?? "root",
      ] as const,
  },
  project: {
    all: ["project"] as const,
    lists: () => [...queryKeys.project.all, "list"] as const,
    listPublic: () => [...queryKeys.project.lists(), "public"] as const,
    listAll: () => [...queryKeys.project.lists(), "all"] as const,
    details: () => [...queryKeys.project.all, "detail"] as const,
    detail: (slug: string) => [...queryKeys.project.details(), slug] as const,
    byId: (id: string) => [...queryKeys.project.all, "byId", id] as const,
  },
  snippet: {
    all: ["snippet"] as const,
    lists: () => [...queryKeys.snippet.all, "list"] as const,
    listPublic: () => [...queryKeys.snippet.lists(), "public"] as const,
    listAll: () => [...queryKeys.snippet.lists(), "all"] as const,
    details: () => [...queryKeys.snippet.all, "detail"] as const,
    detail: (slug: string) => [...queryKeys.snippet.details(), slug] as const,
    byId: (id: string) => [...queryKeys.snippet.all, "byId", id] as const,
  },
  service: {
    all: ["service"] as const,
    lists: () => [...queryKeys.service.all, "list"] as const,
    listPublic: () => [...queryKeys.service.lists(), "public"] as const,
    listAll: () => [...queryKeys.service.lists(), "all"] as const,
    details: () => [...queryKeys.service.all, "detail"] as const,
    detail: (slug: string) => [...queryKeys.service.details(), slug] as const,
    byId: (id: string) => [...queryKeys.service.all, "byId", id] as const,
  },
  experience: {
    all: ["experience"] as const,
    lists: () => [...queryKeys.experience.all, "list"] as const,
    listPublic: () => [...queryKeys.experience.lists(), "public"] as const,
    listAll: () => [...queryKeys.experience.lists(), "all"] as const,
    byId: (id: string) => [...queryKeys.experience.all, "byId", id] as const,
  },
  guestbook: {
    all: ["guestbook"] as const,
    list: () => [...queryKeys.guestbook.all, "list"] as const,
  },
  search: {
    all: ["search"] as const,
    query: (q: string) => [...queryKeys.search.all, q] as const,
  },
} as const;
