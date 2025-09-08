import { TRPCError, TRPCRouterRecord } from "@trpc/server";
import { desc, eq } from "drizzle-orm";
import { z } from "zod/v4";
import { deleteFile, getPublicUrlForObject, uploadImage } from "~/lib/s3";
import {
  CreateProjectSchema,
  Project,
  UpdateProjectSchema,
} from "~/lib/server/schema";
import { protectedProcedure, publicProcedure } from "~/trpc/init";

export const projectRouter = {
  all: protectedProcedure.query(({ ctx }) => {
    return ctx.db.query.Project.findMany({
      orderBy: desc(Project.id),
    });
  }),

  allPublic: publicProcedure.query(({ ctx }) => {
    return ctx.db.query.Project.findMany({
      orderBy: desc(Project.isFeatured),
      where: eq(Project.isDraft, false),
    });
  }),

  bySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ ctx, input }) => {
      const project = await ctx.db.query.Project.findFirst({
        where: eq(Project.slug, input.slug),
      });

      if (!project) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Project not found",
        });
      }

      // if project is draft, throw an error unless user is admin
      if (project.isDraft && ctx.session?.user.role !== "ADMIN") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Project is not public",
        });
      }

      return project;
    }),

  byId: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.db.query.Project.findFirst({
        where: eq(Project.id, input.id),
      });
    }),

  create: protectedProcedure
    .input(CreateProjectSchema)
    .mutation(async ({ ctx, input }) => {
      const { thumbnail, ...projectData } = input;

      if (thumbnail) {
        try {
          const imagePath = await uploadImage(
            "projects",
            thumbnail,
            input.slug
          );
          projectData.imagePath = imagePath;
          projectData.imageUrl = getPublicUrlForObject(imagePath);
        } catch (error) {
          // biome-ignore lint/suspicious/noConsole: log error
          console.error(error);
        }
      }

      return ctx.db.insert(Project).values(projectData);
    }),

  update: protectedProcedure
    .input(UpdateProjectSchema)
    .mutation(async ({ ctx, input }) => {
      const { thumbnail, id, ...projectData } = input;

      if (thumbnail) {
        try {
          const existingProject = await ctx.db.query.Project.findFirst({
            where: eq(Project.id, id),
          });
          const oldImagePath = existingProject?.imagePath;

          const imagePath = await uploadImage(
            "projects",
            thumbnail,
            input.slug ?? id
          );
          projectData.imagePath = imagePath;
          projectData.imageUrl = getPublicUrlForObject(imagePath);

          if (oldImagePath) {
            await deleteFile(oldImagePath);
          }
        } catch (error) {
          // biome-ignore lint/suspicious/noConsole: log error
          console.error(error);
        }
      }

      return ctx.db.update(Project).set(projectData).where(eq(Project.id, id));
    }),

  delete: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      const projectToDelete = await ctx.db.query.Project.findFirst({
        where: eq(Project.id, input),
      });

      if (projectToDelete?.imagePath) {
        await deleteFile(projectToDelete.imagePath);
      }

      return ctx.db.delete(Project).where(eq(Project.id, input));
    }),
} satisfies TRPCRouterRecord;
