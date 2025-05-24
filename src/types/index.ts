import type { SimpleIcon } from "simple-icons";
import { type Experience, type Project } from "~/lib/server/schema";

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
