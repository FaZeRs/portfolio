import type { NavItem } from "~/types";

export const navbarLinks: NavItem[] = [
  {
    title: "About",
    href: "/about",
  },
  {
    title: "Blog",
    href: "/blog",
  },
  {
    title: "Projects",
    href: "/projects",
  },
  {
    title: "More",
    content: [
      {
        title: "Snippets",
        href: "/snippets",
        description:
          "Code snippets that I use often. Mostly for personal reference.",
      },
      {
        title: "Stats",
        href: "/stats",
        description: "My personal statistics about coding and other things.",
      },
      {
        title: "Uses",
        href: "/uses",
        description: "My hardware, software, and other tools.",
      },
    ],
  },
];

export const dashboardNavbarLinks: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
  },
  {
    title: "Blog",
    href: "/dashboard/blog",
  },
  {
    title: "Projects",
    href: "/dashboard/projects",
  },
  {
    title: "Experiences",
    href: "/dashboard/experiences",
  },
  {
    title: "Snippets",
    href: "/dashboard/snippets",
  },
];
