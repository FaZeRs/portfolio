import { db } from "@acme/db/client";
import { articles, Experience, Project } from "@acme/db/schema";
import { tool } from "ai";
import { and, arrayContains, desc, eq, ilike, or } from "drizzle-orm";
import { z } from "zod";

export type ToolProject = {
  id: string;
  title: string;
  slug: string;
  description?: string | null;
  stacks?: string[] | null;
  githubUrl?: string | null;
  demoUrl?: string | null;
  isFeatured: boolean;
};

export type ToolArticle = {
  id: string;
  title: string;
  slug: string;
  description?: string | null;
  tags?: string[] | null;
  likes: number;
  views: number;
  createdAt: Date;
};

export type ToolExperience = {
  id: string;
  title: string;
  description?: string | null;
  institution?: string | null;
  type: string | null;
  startDate?: string | null;
  endDate?: string | null;
  isOnGoing: boolean;
};

const getProjects = tool({
  description:
    "Get all published projects from the database. Use this when the user wants to see all projects or browse the portfolio.",
  inputSchema: z.object({}),
  execute: async () => {
    const projects = await db.query.Project.findMany({
      orderBy: desc(Project.isFeatured),
      where: eq(Project.isDraft, false),
      columns: {
        id: true,
        title: true,
        slug: true,
        description: true,
        stacks: true,
        githubUrl: true,
        demoUrl: true,
        isFeatured: true,
      },
    });
    return projects;
  },
});

const searchProjects = tool({
  description:
    "Search for projects based on technology stack, title, or description. Use this when the user asks about specific technologies, frameworks, or project types.",
  inputSchema: z.object({
    query: z
      .string()
      .describe(
        "Search query - can be technology names, project titles, or descriptions"
      ),
  }),
  execute: async ({ query }) => {
    const searchTerm = `%${query.toLowerCase()}%`;

    const projects = await db.query.Project.findMany({
      orderBy: desc(Project.isFeatured),
      where: and(
        eq(Project.isDraft, false),
        or(
          ilike(Project.title, searchTerm),
          ilike(Project.description, searchTerm),
          arrayContains(
            Project.stacks,
            query.split(" ").map((tag) => tag.trim())
          )
        )
      ),
      columns: {
        id: true,
        title: true,
        slug: true,
        description: true,
        stacks: true,
        githubUrl: true,
        demoUrl: true,
        isFeatured: true,
      },
    });

    return projects;
  },
});

const recommendProject = tool({
  description:
    "Recommend a specific project by ID. Use this when you want to highlight a particular project that matches the user's interests or when they ask about a specific project.",
  inputSchema: z.object({
    id: z.string().describe("The ID of the project to recommend"),
  }),
  execute: async ({ id }) => {
    const project = await db.query.Project.findFirst({
      where: and(eq(Project.id, id), eq(Project.isDraft, false)),
      columns: {
        id: true,
        title: true,
        slug: true,
        description: true,
        stacks: true,
        githubUrl: true,
        demoUrl: true,
        isFeatured: true,
      },
    });

    if (!project) {
      throw new Error(`Project with ID ${id} not found`);
    }

    return project;
  },
});

const getArticles = tool({
  description:
    "Get all published articles from the database. Use this when the user wants to see all blog posts or browse articles.",
  inputSchema: z.object({}),
  execute: async () => {
    const blogPosts = await db.query.articles.findMany({
      orderBy: desc(articles.createdAt),
      where: eq(articles.isDraft, false),
      columns: {
        id: true,
        title: true,
        slug: true,
        description: true,
        tags: true,
        likes: true,
        createdAt: true,
      },
    });
    return blogPosts;
  },
});

const searchArticles = tool({
  description:
    "Search for articles based on title, description, or tags. Use this when the user asks about specific topics or technologies mentioned in articles.",
  inputSchema: z.object({
    query: z
      .string()
      .describe("Search query - can be article titles, descriptions, or tags"),
  }),
  execute: async ({ query }) => {
    const searchTerm = `%${query.toLowerCase()}%`;

    const blogPosts = await db.query.articles.findMany({
      orderBy: desc(articles.createdAt),
      where: and(
        eq(articles.isDraft, false),
        or(
          ilike(articles.title, searchTerm),
          ilike(articles.description, searchTerm),
          arrayContains(
            articles.tags,
            query.split(" ").map((tag) => tag.trim())
          )
        )
      ),
      columns: {
        id: true,
        title: true,
        slug: true,
        description: true,
        tags: true,
        likes: true,
        createdAt: true,
      },
    });

    return blogPosts;
  },
});

const recommendArticle = tool({
  description:
    "Recommend a specific article by ID. Use this when you want to highlight a particular article that matches the user's interests or when they ask about a specific article.",
  inputSchema: z.object({
    id: z.string().describe("The ID of the article to recommend"),
  }),
  execute: async ({ id }) => {
    const article = await db.query.articles.findFirst({
      where: and(eq(articles.id, id), eq(articles.isDraft, false)),
      columns: {
        id: true,
        title: true,
        slug: true,
        description: true,
        tags: true,
        likes: true,
        createdAt: true,
      },
    });

    if (!article) {
      throw new Error(`Article with ID ${id} not found`);
    }

    return article;
  },
});

const getExperience = tool({
  description:
    "Get all published experience entries from the database. Use this when the user wants to see work history, education, or other experience.",
  inputSchema: z.object({}),
  execute: async () => {
    const experienceList = await db.query.Experience.findMany({
      orderBy: desc(Experience.id),
      where: eq(Experience.isDraft, false),
      columns: {
        id: true,
        title: true,
        description: true,
        institution: true,
        type: true,
        startDate: true,
        endDate: true,
        isOnGoing: true,
      },
    });
    return experienceList;
  },
});

const searchExperience = tool({
  description:
    "Search for experience entries based on title, description, institution, or type. Use this when the user asks about specific roles, companies, or types of experience.",
  inputSchema: z.object({
    query: z
      .string()
      .describe(
        "Search query - can be job titles, company names, or experience types"
      ),
  }),
  execute: async ({ query }) => {
    const searchTerm = `%${query.toLowerCase()}%`;

    const experienceList = await db.query.Experience.findMany({
      orderBy: desc(Experience.id),
      where: and(
        eq(Experience.isDraft, false),
        or(
          ilike(Experience.title, searchTerm),
          ilike(Experience.description, searchTerm),
          ilike(Experience.institution, searchTerm),
          ilike(Experience.type, searchTerm)
        )
      ),
      columns: {
        id: true,
        title: true,
        description: true,
        institution: true,
        type: true,
        startDate: true,
        endDate: true,
        isOnGoing: true,
      },
    });

    return experienceList;
  },
});

const recommendExperience = tool({
  description:
    "Recommend a specific experience entry by ID. Use this when you want to highlight a particular experience that matches the user's interests or when they ask about a specific role.",
  inputSchema: z.object({
    id: z.string().describe("The ID of the experience to recommend"),
  }),
  execute: async ({ id }) => {
    const experience = await db.query.Experience.findFirst({
      where: and(eq(Experience.id, id), eq(Experience.isDraft, false)),
      columns: {
        id: true,
        title: true,
        description: true,
        institution: true,
        type: true,
        startDate: true,
        endDate: true,
        isOnGoing: true,
      },
    });

    if (!experience) {
      throw new Error(`Experience with ID ${id} not found`);
    }

    return experience;
  },
});

export default function getTools() {
  return {
    getProjects,
    searchProjects,
    recommendProject,
    getArticles,
    searchArticles,
    recommendArticle,
    getExperience,
    searchExperience,
    recommendExperience,
  };
}
