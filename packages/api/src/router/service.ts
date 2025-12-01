import {
  CreateServiceSchema,
  Service,
  UpdateServiceSchema,
} from "@acme/db/schema";
import { TRPCError, TRPCRouterRecord } from "@trpc/server";
import { desc, eq } from "drizzle-orm";
import { z } from "zod/v4";
import { deleteFile, uploadImage } from "../s3";
import { protectedProcedure, publicProcedure } from "../trpc";

export const serviceRouter = {
  all: protectedProcedure.query(({ ctx }) =>
    ctx.db.query.Service.findMany({
      orderBy: desc(Service.id),
    })
  ),

  allPublic: publicProcedure.query(({ ctx }) =>
    ctx.db.query.Service.findMany({
      where: eq(Service.isDraft, false),
    })
  ),

  bySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ ctx, input }) => {
      const service = await ctx.db.query.Service.findFirst({
        where: eq(Service.slug, input.slug),
      });

      if (!service) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Service not found",
        });
      }

      // if project is draft, throw an error unless user is admin
      if (service.isDraft && ctx.session?.user.role !== "admin") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Service is not public",
        });
      }

      return service;
    }),

  byId: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) =>
      ctx.db.query.Service.findFirst({
        where: eq(Service.id, input.id),
      })
    ),

  create: protectedProcedure
    .input(CreateServiceSchema)
    .mutation(async ({ ctx, input }) => {
      const { thumbnail, ...serviceData } = input;

      if (thumbnail) {
        try {
          const imageUrl = await uploadImage("projects", thumbnail, input.slug);
          serviceData.imageUrl = imageUrl;
        } catch (error) {
          console.error(error);
        }
      }

      return ctx.db.insert(Service).values(serviceData);
    }),

  update: protectedProcedure
    .input(UpdateServiceSchema)
    .mutation(async ({ ctx, input }) => {
      const { thumbnail, id, ...serviceData } = input;

      if (thumbnail) {
        try {
          const existingService = await ctx.db.query.Service.findFirst({
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

      return ctx.db.update(Service).set(serviceData).where(eq(Service.id, id));
    }),

  delete: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      const serviceToDelete = await ctx.db.query.Service.findFirst({
        where: eq(Service.id, input),
      });

      if (serviceToDelete?.imageUrl) {
        await deleteFile(serviceToDelete.imageUrl);
      }

      return ctx.db.delete(Service).where(eq(Service.id, input));
    }),
} satisfies TRPCRouterRecord;
