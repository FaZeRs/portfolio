import { TRPCRouterRecord } from "@trpc/server";
import { put } from "@vercel/blob";
import { desc, eq } from "drizzle-orm";
import { z } from "zod";

import { CreateProjectSchema, Project, UpdateProjectSchema } from "~/lib/server/schema";
import { protectedProcedure, publicProcedure } from "~/trpc/init";

export const projectRouter = {
  all: publicProcedure.query(({ ctx }) => {
    return ctx.db.query.Project.findMany({
      orderBy: desc(Project.id),
      limit: 10,
    });
  }),

  byId: publicProcedure.input(z.object({ id: z.string() })).query(({ ctx, input }) => {
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
          const fileName = `${input.slug}-${Date.now()}.avif`;
          const imageBuffer = Buffer.from(thumbnail, "base64");

          const { url } = await put(`projects/${fileName}`, imageBuffer, {
            access: "public",
            contentType: "image/avif",
          });

          projectData.imageUrl = url;
        } catch (error) {
          console.error("Error uploading image:", error);
          throw new Error("Failed to upload image");
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
          const fileName = `${input.slug || id}-${Date.now()}.avif`;
          const imageBuffer = Buffer.from(thumbnail, "base64");

          const { url } = await put(`projects/${fileName}`, imageBuffer, {
            access: "public",
            contentType: "image/avif",
          });

          projectData.imageUrl = url;
        } catch (error) {
          console.error("Error uploading image:", error);
          throw new Error("Failed to upload image");
        }
      }

      return ctx.db.update(Project).set(projectData).where(eq(Project.id, id));
    }),

  delete: protectedProcedure.input(z.string()).mutation(({ ctx, input }) => {
    return ctx.db.delete(Project).where(eq(Project.id, input));
  }),
} satisfies TRPCRouterRecord;
