import type { db as DB } from "@acme/db/client";
import {
  CreateExperienceSchema,
  Experience,
  UpdateExperienceSchema,
} from "@acme/db/schema";
import { desc, eq } from "drizzle-orm";
import type { z } from "zod/v4";
import { deleteFile, uploadImage } from "../s3";

type DbClient = typeof DB;

export function getAll(db: DbClient) {
  return db.query.Experience.findMany({
    orderBy: desc(Experience.id),
  });
}

export function getAllPublic(db: DbClient) {
  return db.query.Experience.findMany({
    orderBy: desc(Experience.id),
    where: eq(Experience.isDraft, false),
  });
}

export function getById(db: DbClient, input: { id: string }) {
  return db.query.Experience.findFirst({
    where: eq(Experience.id, input.id),
  });
}

export async function create(
  db: DbClient,
  input: z.infer<typeof CreateExperienceSchema>
) {
  const { thumbnail, ...experienceData } = input;

  const dataToInsert = {
    ...experienceData,
    startDate: experienceData.startDate || null,
    endDate: experienceData.endDate || null,
  };

  if (thumbnail) {
    try {
      const imageUrl = await uploadImage("experiences", thumbnail, input.title);
      dataToInsert.imageUrl = imageUrl;
    } catch (error) {
      console.error(error);
    }
  }

  return db.insert(Experience).values(dataToInsert);
}

export async function update(
  db: DbClient,
  input: z.infer<typeof UpdateExperienceSchema>
) {
  const { thumbnail, id, ...experienceData } = input;

  const dataToUpdate = {
    ...experienceData,
    startDate: experienceData.startDate || null,
    endDate: experienceData.endDate || null,
  };

  if (thumbnail) {
    try {
      const existingExperience = await db.query.Experience.findFirst({
        where: eq(Experience.id, id),
      });
      const oldImageUrl = existingExperience?.imageUrl;

      const imageUrl = await uploadImage("experiences", thumbnail, id);
      dataToUpdate.imageUrl = imageUrl;

      if (oldImageUrl) {
        await deleteFile(oldImageUrl);
      }
    } catch (error) {
      console.error(error);
    }
  }

  return db.update(Experience).set(dataToUpdate).where(eq(Experience.id, id));
}

export async function remove(db: DbClient, id: string) {
  const experienceToDelete = await db.query.Experience.findFirst({
    where: eq(Experience.id, id),
  });

  if (experienceToDelete?.imageUrl) {
    await deleteFile(experienceToDelete.imageUrl);
  }

  return db.delete(Experience).where(eq(Experience.id, id));
}
