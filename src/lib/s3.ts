import { del, put } from "@vercel/blob";
import { MAX_IMAGE_SIZE } from "./constants";

const allowedDomains = ["vercel-blob.com", "blob.vercel-storage.com"];
const BASE64_REGEX = /^[A-Za-z0-9+/=]+$/;

export async function uploadImage(folder: string, image: string, slug: string) {
  try {
    if (!image?.trim()) {
      throw new Error("Invalid image: empty string provided");
    }

    if (!BASE64_REGEX.test(image)) {
      throw new Error("Invalid base64 format");
    }

    if (Buffer.byteLength(image, "base64") > MAX_IMAGE_SIZE) {
      throw new Error("Image exceeds maximum allowed size");
    }

    const fileName = `${slug}-${Date.now()}.avif`;
    const imageBuffer = Buffer.from(image, "base64");
    const path = `${folder}/${fileName}`;

    const { url } = await put(path, imageBuffer, {
      access: "public",
      contentType: "image/avif",
    });
    return url;
  } catch (_error) {
    throw new Error("Failed to upload image", { cause: _error as Error });
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
  } catch (_error) {
    throw new Error("Failed to delete file", { cause: _error as Error });
  }
}
