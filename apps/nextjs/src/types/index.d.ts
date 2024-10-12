import type { SimpleIcon } from "simple-icons";

export interface SiteConfig {
  name: string;
  handle: string;
  description: string;
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
