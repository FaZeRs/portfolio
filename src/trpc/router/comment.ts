import { TRPCError, TRPCRouterRecord } from "@trpc/server";
import { and, asc, count, desc, eq, isNull } from "drizzle-orm";
import { z } from "zod/v4";

import { commentReactions, comments } from "~/lib/server/schema";
import { protectedProcedure, publicProcedure } from "~/trpc/init";

const baseJSONContent = z.object({
  type: z.string().optional(),
  attrs: z.record(z.any(), z.any()).optional(),
  marks: z
    .array(
      z.object({
        type: z.string(),
        attrs: z.record(z.any(), z.any()).optional(),
      }),
    )
    .optional(),
  text: z.string().optional(),
});

const JSONContentSchema: z.ZodType<z.infer<typeof baseJSONContent>> =
  baseJSONContent.extend({
    content: z.array(z.lazy(() => JSONContentSchema)).optional(),
  });

export const commentRouter = {
  create: protectedProcedure
    .input(
      z.object({
        articleId: z.uuid(),
        content: JSONContentSchema,
        parentId: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.insert(comments).values({
        userId: ctx.session?.user.id,
        articleId: input.articleId,
        content: input.content,
        parentId: input.parentId,
      });
    }),
  all: publicProcedure
    .input(
      z.object({
        articleId: z.uuid(),
        parentId: z.string().optional(),
        sort: z.enum(["asc", "desc"]).optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const query = await ctx.db.query.comments.findMany({
        where: input.parentId
          ? and(
              eq(comments.articleId, input.articleId),
              eq(comments.parentId, input.parentId),
            )
          : and(
              eq(comments.articleId, input.articleId),
              isNull(comments.parentId),
            ),
        with: {
          user: true,
        },
        orderBy:
          input.sort === "asc"
            ? asc(comments.createdAt)
            : desc(comments.createdAt),
      });

      const formattedComments = await Promise.all(
        query.map(async (comment) => {
          const [{ count: repliesCount }] = await ctx.db
            .select({ count: count() })
            .from(comments)
            .where(eq(comments.parentId, comment.id));

          const [{ count: likesCount }] = await ctx.db
            .select({ count: count() })
            .from(commentReactions)
            .where(
              and(
                eq(commentReactions.commentId, comment.id),
                eq(commentReactions.like, true),
              ),
            );

          const [{ count: dislikesCount }] = await ctx.db
            .select({ count: count() })
            .from(commentReactions)
            .where(
              and(
                eq(commentReactions.commentId, comment.id),
                eq(commentReactions.like, false),
              ),
            );

          const userReaction = await ctx.db.query.commentReactions.findFirst({
            where: and(
              eq(commentReactions.commentId, comment.id),
              eq(commentReactions.userId, ctx.session?.user.id ?? ""),
            ),
          });

          const liked = Boolean(userReaction && userReaction.like === true);
          const disliked = Boolean(userReaction && userReaction.like === false);

          return {
            ...comment,
            likesCount,
            dislikesCount,
            repliesCount,
            liked,
            disliked,
          };
        }),
      );

      return formattedComments;
    }),
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { id } = input;
      const comment = await ctx.db.query.comments.findFirst({
        where: eq(comments.id, id),
      });

      if (!comment) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Comment not found",
        });
      }

      if (comment.userId !== ctx.session?.user.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You are not allowed to delete this comment",
        });
      }

      return ctx.db.delete(comments).where(eq(comments.id, id));
    }),
  react: protectedProcedure
    .input(z.object({ id: z.string(), like: z.boolean() }))
    .mutation(async ({ ctx, input }) => {
      const { id, like } = input;
      const comment = await ctx.db.query.comments.findFirst({
        where: eq(comments.id, id),
      });

      if (!comment) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Comment not found",
        });
      }

      if (comment.userId === ctx.session?.user.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You are not allowed to react to your own comment",
        });
      }

      const existingReaction = await ctx.db.query.commentReactions.findFirst({
        where: and(
          eq(commentReactions.commentId, id),
          eq(commentReactions.userId, ctx.session?.user.id),
        ),
      });

      if (existingReaction) {
        return ctx.db
          .update(commentReactions)
          .set({ like })
          .where(eq(commentReactions.id, existingReaction.id));
      }

      return ctx.db.insert(commentReactions).values({
        commentId: id,
        userId: ctx.session?.user.id,
        like,
      });
    }),
} satisfies TRPCRouterRecord;

// export type GetCommentsResponse = RouterOutputs["comment"]["all"]
// export type CommentResponse = RouterOutputs["comment"]["all"][0]
