import { del, put } from "@vercel/blob";
import { type ClassValue, clsx } from "clsx";
import { remark } from "remark";
import { twMerge } from "tailwind-merge";
import { remarkHeading } from "~/lib/mdx-plugins/remark/remark-heading";
import { TOC } from "~/types";
import { MAX_IMAGE_SIZE } from "./constants";

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

export const getBaseUrl = () => {
  if (typeof window !== "undefined") return window.location.origin;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return `http://localhost:${process.env.PORT ?? 3000}`;
};

export const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, "") // Remove special characters
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-") // Replace multiple hyphens with single hyphen
    .trim();
};

const allowedDomains = ["vercel-blob.com"];

export async function uploadImage(folder: string, image: string, slug: string) {
  try {
    if (!image?.trim()) {
      throw new Error("Invalid image: empty string provided");
    }

    if (!/^[A-Za-z0-9+/=]+$/.test(image)) {
      throw new Error("Invalid base64 format");
    }

    if (Buffer.byteLength(image, "base64") > MAX_IMAGE_SIZE) {
      throw new Error("Image exceeds maximum allowed size");
    }

    const fileName = `${slug}-${Date.now()}.avif`;
    const imageBuffer = Buffer.from(image, "base64");

    const { url } = await put(`${folder}/${fileName}`, imageBuffer, {
      access: "public",
      contentType: "image/avif",
    });

    return url;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw new Error("Failed to upload image");
  }
}

export async function deleteFile(url: string) {
  try {
    if (!url?.trim()) {
      throw new Error("Invalid URL: empty string provided");
    }

    const urlObj = new URL(url);
    if (!allowedDomains.some((domain) => urlObj.hostname.includes(domain))) {
      throw new Error("URL does not belong to an allowed storage domain");
    }

    await del(url);
  } catch (error) {
    console.error("Error deleting file:", error);
    throw new Error("Failed to delete file");
  }
}

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
