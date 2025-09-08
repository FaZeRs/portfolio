import { type ClassValue, clsx } from "clsx";
import { remark } from "remark";
import { twMerge } from "tailwind-merge";
import { remarkHeading } from "~/lib/mdx-plugins/remark/remark-heading";
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

export const getTOC = async (content: string) => {
  const result = await remark().use(remarkHeading).process(content);

  if ("toc" in result.data) {
    return result.data.toc as TOC[];
  }

  return [];
};
