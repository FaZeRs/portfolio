import { TRPCRouterRecord } from "@trpc/server";
import { desc, eq } from "drizzle-orm";
import { z } from "zod";

import {
  CreateExperienceSchema,
  Experience,
  UpdateExperienceSchema,
} from "~/lib/server/schema";
import { deleteFile, uploadImage } from "~/lib/utils";
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
          dataToInsert.imageUrl = await uploadImage(
            "experiences",
            thumbnail,
            input.title,
          );
        } catch (error) {
          console.error("Error uploading image:", error);
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

          dataToUpdate.imageUrl = await uploadImage(
            "experiences",
            thumbnail,
            id,
          );

          if (oldImageUrl) {
            await deleteFile(oldImageUrl);
          }
        } catch (error) {
          console.error("Error uploading image:", error);
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
