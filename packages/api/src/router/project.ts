import {
  CreateProjectSchema,
  Project,
  UpdateProjectSchema,
} from "@acme/db/schema";
import { getTOC } from "@acme/utils";
import { TRPCError, TRPCRouterRecord } from "@trpc/server";
import { desc, eq } from "drizzle-orm";
import { z } from "zod/v4";
import { deleteFile, uploadImage } from "../s3";
import { protectedProcedure, publicProcedure } from "../trpc";

export const projectRouter = {
  all: protectedProcedure.query(({ ctx }) =>
    ctx.db.query.Project.findMany({
      orderBy: desc(Project.id),
    })
  ),

  allPublic: publicProcedure.query(({ ctx }) =>
    ctx.db.query.Project.findMany({
      orderBy: desc(Project.isFeatured),
      where: eq(Project.isDraft, false),
    })
  ),

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
      if (project.isDraft && ctx.session?.user.role !== "admin") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Project is not public",
        });
      }

      const toc = await getTOC(project.content ?? "");

      return { ...project, toc };
    }),

  byId: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) =>
      ctx.db.query.Project.findFirst({
        where: eq(Project.id, input.id),
      })
    ),

  create: protectedProcedure
    .input(CreateProjectSchema)
    .mutation(async ({ ctx, input }) => {
      const { thumbnail, ...projectData } = input;

      if (thumbnail) {
        try {
          const imageUrl = await uploadImage("projects", thumbnail, input.slug);
          projectData.imageUrl = imageUrl;
        } catch (error) {
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

      return ctx.db.update(Project).set(projectData).where(eq(Project.id, id));
    }),

  delete: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      const projectToDelete = await ctx.db.query.Project.findFirst({
        where: eq(Project.id, input),
      });

      if (projectToDelete?.imageUrl) {
        await deleteFile(projectToDelete.imageUrl);
      }

      return ctx.db.delete(Project).where(eq(Project.id, input));
    }),
} satisfies TRPCRouterRecord;
