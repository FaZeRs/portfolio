import type { NavItem } from "@acme/types";

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
      {
        title: "Changelog",
        href: "/changelog",
        description: "All notable changes and updates to this website.",
      },
    ],
  },
];
