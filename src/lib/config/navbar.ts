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
      {
        title: "Bookmarks",
        href: "/bookmarks",
        description: "My bookmarks from the web.",
      },
      {
        title: "Guestbook",
        href: "/guestbook",
        description: "A place for you to leave your comments and feedback.",
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
  {
    title: "Services",
    href: "/dashboard/services",
  },
  {
    title: "Users",
    href: "/dashboard/users",
  },
];
