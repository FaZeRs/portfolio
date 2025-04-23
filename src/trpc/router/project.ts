import { TRPCRouterRecord } from "@trpc/server";
import { desc, eq } from "drizzle-orm";
import { z } from "zod";

import { CreateProjectSchema, Project } from "~/lib/server/schema";
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
      // if (input.thumbnail) {
      //   const imageUrl = await put(
      //     `projects/${input.title}.png`,
      //     Buffer.from(input.thumbnail, "base64"),
      //     {
      //       access: "public",
      //     },
      //   );
      //   input.imageUrl = imageUrl.url;
      // }
      return ctx.db.insert(Project).values(input);
    }),

  // update: protectedProcedure
  //   .input(UpdateProjectSchema)
  //   .mutation(async ({ ctx, input }) => {
  //     if (input.thumbnail) {
  //       const imageUrl = await put(
  //         `projects/${input.title}.png`,
  //         Buffer.from(input.thumbnail, "base64"),
  //         {
  //           access: "public",
  //         },
  //       );
  //       input.imageUrl = imageUrl.url;
  //     }
  //     return ctx.db.update(Project).set(input).where(eq(Project.id, input.id));
  //   }),

  delete: protectedProcedure.input(z.string()).mutation(({ ctx, input }) => {
    return ctx.db.delete(Project).where(eq(Project.id, input));
  }),
} satisfies TRPCRouterRecord;
