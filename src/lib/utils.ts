import { type ClassValue, clsx } from "clsx";
import { marked, Tokens } from "marked";
import { twMerge } from "tailwind-merge";
import { TOC } from "~/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(input: string | number | Date): string {
  const date = new Date(input);
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

const DEFAULT_PORT = 3000 as const;

export const getBaseUrl = () => {
  if (process.env.VITE_BASE_URL) {
    return process.env.VITE_BASE_URL;
  }
  if (typeof window !== "undefined") {
    return window.location.origin;
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return `http://localhost:${process.env.PORT ?? DEFAULT_PORT}`;
};

export const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, "") // Remove special characters
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-") // Replace multiple hyphens with single hyphen
    .trim();
};

export const calculateReadingTime = (content: string) => {
  const wordsPerMinute = 200;
  const numberOfWords = content.split(/\s/g).length;
  return Math.ceil(numberOfWords / wordsPerMinute);
};

export const stripMarkdown = (text: string): string => {
  return (
    text
      // Remove links [text](url) -> text
      .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
      // Remove inline code `code` -> code
      .replace(/`([^`]+)`/g, "$1")
      // Remove bold/italic **text** or *text* -> text
      .replace(/\*{1,2}([^*]+)\*{1,2}/g, "$1")
      // Remove strikethrough ~~text~~ -> text
      .replace(/~~([^~]+)~~/g, "$1")
      // Remove HTML tags
      .replace(/<[^>]*>/g, "")
      // Clean up extra whitespace
      .replace(/\s+/g, " ")
      .trim()
  );
};

export const getTOC = (content: string): TOC[] => {
  const toc: TOC[] = [];

  const tokens = marked.lexer(content, {});
  const headings = tokens.filter(
    (token) => token.type === "heading"
  ) as Tokens.Heading[];

  for (const heading of headings) {
    const level = heading.depth;
    const title = stripMarkdown(heading.text);
    const id = generateSlug(title);
    toc.push({
      title,
      url: id,
      depth: level,
    });
  }

  return toc;
};
