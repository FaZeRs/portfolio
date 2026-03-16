import type { db as DB } from "@acme/db/client";
import {
  CreateProjectSchema,
  Project,
  UpdateProjectSchema,
} from "@acme/db/schema";
import { getTOC } from "@acme/utils";
import { desc, eq } from "drizzle-orm";
import type { z } from "zod/v4";
import { deleteFile, uploadImage } from "../s3";

type DbClient = typeof DB;

export function getAll(db: DbClient) {
  return db.query.Project.findMany({
    orderBy: desc(Project.id),
  });
}

export function getAllPublic(db: DbClient) {
  return db.query.Project.findMany({
    orderBy: desc(Project.isFeatured),
    where: eq(Project.isDraft, false),
  });
}

export async function getBySlug(
  db: DbClient,
  input: { slug: string },
  session?: { user: { role: string } } | null
) {
  const project = await db.query.Project.findFirst({
    where: eq(Project.slug, input.slug),
  });

  if (!project) {
    throw new Error("Project not found");
  }

  // if project is draft, throw an error unless user is admin
  if (project.isDraft && session?.user.role !== "admin") {
    throw new Error("Project is not public");
  }

  const toc = await getTOC(project.content ?? "");

  return { ...project, toc };
}

export function getById(db: DbClient, input: { id: string }) {
  return db.query.Project.findFirst({
    where: eq(Project.id, input.id),
  });
}

export async function create(
  db: DbClient,
  input: z.infer<typeof CreateProjectSchema>
) {
  const { thumbnail, ...projectData } = input;

  if (thumbnail) {
    try {
      const imageUrl = await uploadImage("projects", thumbnail, input.slug);
      projectData.imageUrl = imageUrl;
    } catch (error) {
      console.error(error);
    }
  }

  return db.insert(Project).values(projectData);
}

export async function update(
  db: DbClient,
  input: z.infer<typeof UpdateProjectSchema>
) {
  const { thumbnail, id, ...projectData } = input;

  if (thumbnail) {
    try {
      const existingProject = await db.query.Project.findFirst({
        where: eq(Project.id, id),
      });
      const oldImageUrl = existingProject?.imageUrl;

      const imageUrl = await uploadImage(
        "projects",
        thumbnail,
        input.slug ?? id
      );
      projectData.imageUrl = imageUrl;

      if (oldImageUrl) {
        await deleteFile(oldImageUrl);
      }
    } catch (error) {
      console.error(error);
    }
  }

  return db.update(Project).set(projectData).where(eq(Project.id, id));
}

export async function remove(db: DbClient, id: string) {
  const projectToDelete = await db.query.Project.findFirst({
    where: eq(Project.id, id),
  });

  if (projectToDelete?.imageUrl) {
    await deleteFile(projectToDelete.imageUrl);
  }

  return db.delete(Project).where(eq(Project.id, id));
}
