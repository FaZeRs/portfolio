import {
  type articles,
  commentReactions,
  comments,
  type Experience,
  guestbook,
  type Project,
  type Service,
  type Snippet,
  user,
} from "@acme/db/schema";
import type { SimpleIcon } from "simple-icons";

export interface SiteConfig {
  author: {
    name: string;
    email: string;
    url: string;
    handle: string;
  };
  calendlyUrl: string;
  description: string;
  keywords: string;
  links: {
    mail: string;
    twitter: string;
    github: string;
    githubRepo: string;
  };
  name: string;
  title: string;
  url: string;
}

export interface NavItem {
  content?: ContentNavItem[];
  description?: string;
  disabled?: boolean;
  href?: string;
  title: string;
}

export interface ContentNavItem extends NavItem {
  href: string;
}

export interface Social {
  icon: SimpleIcon;
  name: string;
  url: string;
  username?: string;
}

export interface AuthProvider {
  icon: SimpleIcon;
  label: string;
  provider: string;
}

export type ProjectType = typeof Project.$inferSelect;
export type ExperienceType = typeof Experience.$inferSelect;
export type SnippetType = typeof Snippet.$inferSelect;
export type ArticleType = typeof articles.$inferSelect;
export type CommentType = typeof comments.$inferSelect;
export type UserType = typeof user.$inferSelect;
export type CommentReactionType = typeof commentReactions.$inferSelect;
export type GuestbookType = typeof guestbook.$inferSelect;
export type ServiceType = typeof Service.$inferSelect;

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

export interface GitHubUser {
  avatar_url: string;
  bio: string;
  created_at: string;
  followers: number;
  following: number;
  html_url: string;
  login: string;
  name: string;
  public_repos: number;
  updated_at: string;
}

export interface UseData {
  description: string;
  icon: SimpleIcon;
  link: string;
  name: string;
}

export interface TOC {
  depth: number;
  title: string;
  url: string;
}

export interface Collection {
  _id: string;
  count: number;
  description: string;
  slug: string;
  title: string;
}

export interface Bookmark {
  _id: string;
  cover: string;
  domain: string;
  excerpt: string;
  link: string;
  note: string;
  tags: string[];
  title: string;
}
