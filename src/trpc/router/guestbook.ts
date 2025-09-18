import { TRPCError, TRPCRouterRecord } from "@trpc/server";
import { desc, eq } from "drizzle-orm";
import { z } from "zod/v4";

import { guestbook } from "~/lib/server/schema";
import { protectedProcedure, publicProcedure } from "~/trpc/init";

export const guestbookRouter = {
  create: protectedProcedure
    .input(
      z.object({
        message: z
          .string()
          .trim()
          .min(1, "Message cannot be empty")
          // biome-ignore lint/style/noMagicNumbers: valid use case
          .max(500, "Message is too long"),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.db.insert(guestbook).values({
        userId: ctx.session.user.id,
        message: input.message,
      });
    }),
  all: publicProcedure.query(({ ctx }) => {
    return ctx.db.query.guestbook.findMany({
      orderBy: desc(guestbook.id),
      with: {
        user: {
          columns: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    });
  }),
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { id } = input;
      const comment = await ctx.db.query.guestbook.findFirst({
        where: eq(guestbook.id, id),
      });

      if (!comment) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Guestbook entry not found",
        });
      }

      if (
        comment.userId !== ctx.session.user.id &&
        ctx.session.user.role !== "admin"
      ) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You are not allowed to delete this guestbook entry",
        });
      }

      return ctx.db.delete(guestbook).where(eq(guestbook.id, id));
    }),
} satisfies TRPCRouterRecord;
