import type { db as DB } from "@acme/db/client";
import {
  CreateServiceSchema,
  Service,
  UpdateServiceSchema,
} from "@acme/db/schema";
import { desc, eq } from "drizzle-orm";
import type { z } from "zod/v4";
import { deleteFile, uploadImage } from "../s3";

type DbClient = typeof DB;

export function getAll(db: DbClient) {
  return db.query.Service.findMany({
    orderBy: desc(Service.id),
  });
}

export function getAllPublic(db: DbClient) {
  return db.query.Service.findMany({
    where: eq(Service.isDraft, false),
  });
}

export async function getBySlug(
  db: DbClient,
  input: { slug: string },
  session?: { user: { role: string } } | null
) {
  const service = await db.query.Service.findFirst({
    where: eq(Service.slug, input.slug),
  });

  if (!service) {
    throw new Error("Service not found");
  }

  // if service is draft, throw an error unless user is admin
  if (service.isDraft && session?.user.role !== "admin") {
    throw new Error("Service is not public");
  }

  return service;
}

export function getById(db: DbClient, input: { id: string }) {
  return db.query.Service.findFirst({
    where: eq(Service.id, input.id),
  });
}

export async function create(
  db: DbClient,
  input: z.infer<typeof CreateServiceSchema>
) {
  const { thumbnail, ...serviceData } = input;

  if (thumbnail) {
    try {
      const imageUrl = await uploadImage("projects", thumbnail, input.slug);
      serviceData.imageUrl = imageUrl;
    } catch (error) {
      console.error(error);
    }
  }

  return db.insert(Service).values(serviceData);
}

export async function update(
  db: DbClient,
  input: z.infer<typeof UpdateServiceSchema>
) {
  const { thumbnail, id, ...serviceData } = input;

  if (thumbnail) {
    try {
      const existingService = await db.query.Service.findFirst({
        where: eq(Service.id, id),
      });
      const oldImageUrl = existingService?.imageUrl;

      const imageUrl = await uploadImage(
        "services",
        thumbnail,
        input.slug ?? id
      );
      serviceData.imageUrl = imageUrl;

      if (oldImageUrl) {
        await deleteFile(oldImageUrl);
      }
    } catch (error) {
      console.error(error);
    }
  }

  return db.update(Service).set(serviceData).where(eq(Service.id, id));
}

export async function remove(db: DbClient, id: string) {
  const serviceToDelete = await db.query.Service.findFirst({
    where: eq(Service.id, id),
  });

  if (serviceToDelete?.imageUrl) {
    await deleteFile(serviceToDelete.imageUrl);
  }

  return db.delete(Service).where(eq(Service.id, id));
}
