import { TRPCRouterRecord } from "@trpc/server";
import { desc, eq } from "drizzle-orm";
import { z } from "zod/v4";
import { deleteFile, getPublicUrlForObject, uploadImage } from "~/lib/s3";
import {
  CreateExperienceSchema,
  Experience,
  UpdateExperienceSchema,
} from "~/lib/server/schema";
import { protectedProcedure, publicProcedure } from "~/trpc/init";

export const experienceRouter = {
  all: protectedProcedure.query(({ ctx }) => {
    return ctx.db.query.Experience.findMany({
      orderBy: desc(Experience.id),
    });
  }),

  allPublic: publicProcedure.query(({ ctx }) => {
    return ctx.db.query.Experience.findMany({
      orderBy: desc(Experience.id),
      where: eq(Experience.isDraft, false),
    });
  }),

  byId: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.db.query.Experience.findFirst({
        where: eq(Experience.id, input.id),
      });
    }),

  create: protectedProcedure
    .input(CreateExperienceSchema)
    .mutation(async ({ ctx, input }) => {
      const { thumbnail, ...experienceData } = input;

      const dataToInsert = {
        ...experienceData,
        startDate: experienceData.startDate || null,
        endDate: experienceData.endDate || null,
      };

      if (thumbnail) {
        try {
          const imagePath = await uploadImage(
            "experiences",
            thumbnail,
            input.title
          );
          dataToInsert.imagePath = imagePath;
          dataToInsert.imageUrl = getPublicUrlForObject(imagePath);
        } catch (error) {
          // biome-ignore lint/suspicious/noConsole: log error
          console.error(error);
        }
      }

      return ctx.db.insert(Experience).values(dataToInsert);
    }),

  update: protectedProcedure
    .input(UpdateExperienceSchema)
    .mutation(async ({ ctx, input }) => {
      const { thumbnail, id, ...experienceData } = input;

      const dataToUpdate = {
        ...experienceData,
        startDate: experienceData.startDate || null,
        endDate: experienceData.endDate || null,
      };

      if (thumbnail) {
        try {
          const existingExperience = await ctx.db.query.Experience.findFirst({
            where: eq(Experience.id, id),
          });
          const oldImagePath = existingExperience?.imagePath;

          const imagePath = await uploadImage("experiences", thumbnail, id);
          dataToUpdate.imagePath = imagePath;
          dataToUpdate.imageUrl = getPublicUrlForObject(imagePath);

          if (oldImagePath) {
            await deleteFile(oldImagePath);
          }
        } catch (error) {
          // biome-ignore lint/suspicious/noConsole: log error
          console.error(error);
        }
      }

      return ctx.db
        .update(Experience)
        .set(dataToUpdate)
        .where(eq(Experience.id, id));
    }),

  delete: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      const experienceToDelete = await ctx.db.query.Experience.findFirst({
        where: eq(Experience.id, input),
      });

      if (experienceToDelete?.imagePath) {
        await deleteFile(experienceToDelete.imagePath);
      }

      return ctx.db.delete(Experience).where(eq(Experience.id, input));
    }),
} satisfies TRPCRouterRecord;
