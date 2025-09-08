import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { MAX_IMAGE_SIZE } from "./constants";
import { env } from "./env.server";

const s3Client = new S3Client({
  region: env.S3_REGION,
  endpoint: env.S3_ENDPOINT,
  credentials: {
    accessKeyId: env.S3_ACCESS_KEY_ID,
    secretAccessKey: env.S3_SECRET_ACCESS_KEY,
  },
});

export async function getObject(key: string) {
  const res = await s3Client.send(
    new GetObjectCommand({
      Bucket: env.S3_STORAGE_BUCKET,
      Key: key,
    })
  );
  return res;
}

export async function uploadObject(key: string, body: Buffer) {
  const res = await s3Client.send(
    new PutObjectCommand({
      Bucket: env.S3_STORAGE_BUCKET,
      Key: key,
      Body: body,
      Metadata: {
        "Cache-Control": "max-age=3600",
      },
    })
  );
  return res;
}

export async function deleteObject(key: string) {
  const res = await s3Client.send(
    new DeleteObjectCommand({
      Bucket: env.S3_STORAGE_BUCKET,
      Key: key,
    })
  );
  return res;
}

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

    await uploadObject(path, imageBuffer);
    return path;
  } catch (_error) {
    throw new Error("Failed to upload image", { cause: _error as Error });
  }
}

export async function deleteFile(path: string) {
  try {
    if (!path?.trim()) {
      throw new Error("Invalid path: empty string provided");
    }

    await deleteObject(path);
  } catch (_error) {
    throw new Error("Failed to delete file", { cause: _error as Error });
  }
}

const LEADING_SLASHES_RE = /^\/+/;
const TRAILING_SLASHES_RE = /\/+$/;
const AMAZONAWS_RE = /amazonaws\.com/i;

export function getPublicUrlForObject(objectPath: string): string {
  const trimmed = (objectPath ?? "").trim();
  if (!trimmed) {
    throw new Error("Invalid object path: empty string provided");
  }

  const normalizedKey = trimmed.replace(LEADING_SLASHES_RE, "");
  const bucket = env.S3_STORAGE_BUCKET;
  const endpoint = (env.S3_ENDPOINT ?? "").replace(TRAILING_SLASHES_RE, "");
  const region = env.S3_REGION;

  const isAwsEndpoint = AMAZONAWS_RE.test(endpoint);

  if (isAwsEndpoint) {
    return `https://${bucket}.s3.${region}.amazonaws.com/${normalizedKey}`;
  }

  return `${endpoint}/${bucket}/${normalizedKey}`;
}
