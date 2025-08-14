import type { SimpleIcon } from "simple-icons";
import {
  type articles,
  commentReactions,
  comments,
  type Experience,
  type Project,
  type Snippet,
  user,
} from "~/lib/server/schema";

export interface SiteConfig {
  title: string;
  name: string;
  description: string;
  keywords: string;
  url: string;
  links: {
    mail: string;
    twitter: string;
    github: string;
    githubRepo: string;
  };
  author: {
    name: string;
    email: string;
    url: string;
    handle: string;
  };
}

export interface NavItem {
  title: string;
  href?: string;
  disabled?: boolean;
  description?: string;
  content?: ContentNavItem[];
}

export interface ContentNavItem extends NavItem {
  href: string;
}

export interface Social {
  name: string;
  url: string;
  username?: string;
  icon: SimpleIcon;
}

export type ProjectType = typeof Project.$inferSelect;
export type ExperienceType = typeof Experience.$inferSelect;
export type SnippetType = typeof Snippet.$inferSelect;
export type ArticleType = typeof articles.$inferSelect;
export type CommentType = typeof comments.$inferSelect;
export type UserType = typeof user.$inferSelect;
export type CommentReactionType = typeof commentReactions.$inferSelect;

export interface ContributionCalendar {
  weeks: ContributionWeeks[];
}

export interface ContributionWeeks {
  contributionDays: ContributionsDay[];
}

export interface ContributionsDay {
  contributionCount: number;
  date: string;
}

export interface ContributionsCollection {
  contributionCalendar: ContributionCalendar;
}

export type GitHubUser = {
  login: string;
  name: string;
  bio: string;
  avatar_url: string;
  html_url: string;
  public_repos: number;
  followers: number;
  following: number;
  created_at: string;
  updated_at: string;
};

export interface UseData {
  name: string;
  description: string;
  icon: SimpleIcon;
  link: string;
}

export type TOC = {
  title: string;
  url: string;
  depth: number;
};

export type Collection = {
  _id: string;
  title: string;
  description: string;
  slug: string;
  count: number;
};

export type Bookmark = {
  _id: string;
  title: string;
  link: string;
  cover: string;
  tags: string[];
  excerpt: string;
  note: string;
  domain: string;
};
