import { TRPCRouterRecord } from "@trpc/server";
import { desc, eq } from "drizzle-orm";
import { z } from "zod/v4";
import {
  CreateExperienceSchema,
  Experience,
  UpdateExperienceSchema,
} from "~/lib/db/schema";
import { deleteFile, uploadImage } from "~/lib/s3";
import { protectedProcedure, publicProcedure } from "~/trpc/init";

export const experienceRouter = {
  all: protectedProcedure.query(({ ctx }) =>
    ctx.db.query.Experience.findMany({
      orderBy: desc(Experience.id),
    })
  ),

  allPublic: publicProcedure.query(({ ctx }) =>
    ctx.db.query.Experience.findMany({
      orderBy: desc(Experience.id),
      where: eq(Experience.isDraft, false),
    })
  ),

  byId: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) =>
      ctx.db.query.Experience.findFirst({
        where: eq(Experience.id, input.id),
      })
    ),

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
          const imageUrl = await uploadImage(
            "experiences",
            thumbnail,
            input.title
          );
          dataToInsert.imageUrl = imageUrl;
        } catch (error) {
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

      if (experienceToDelete?.imageUrl) {
        await deleteFile(experienceToDelete.imageUrl);
      }

      return ctx.db.delete(Experience).where(eq(Experience.id, input));
    }),
} satisfies TRPCRouterRecord;
