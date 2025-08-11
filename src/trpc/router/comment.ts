import { TRPCError, TRPCRouterRecord } from "@trpc/server";
import { and, eq, isNull, sql } from "drizzle-orm";
import { z } from "zod/v4";

import { commentReactions, comments, user } from "~/lib/server/schema";
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
        userId: ctx.session.user.id,
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
      const commentsWithCounts = await ctx.db
        .select({
          comment: comments,
          user: user,
          repliesCount: sql<number>`(SELECT COUNT(*) FROM ${comments} c2 WHERE c2.parent_id = ${comments.id})`,
          likesCount: sql<number>`(SELECT COUNT(*) FROM ${commentReactions} cr WHERE cr.comment_id = ${comments.id} AND cr.like = true)`,
          dislikesCount: sql<number>`(SELECT COUNT(*) FROM ${commentReactions} cr WHERE cr.comment_id = ${comments.id} AND cr.like = false)`,
          userReaction: commentReactions,
        })
        .from(comments)
        .leftJoin(user, eq(comments.userId, user.id))
        .leftJoin(
          commentReactions,
          and(
            eq(commentReactions.commentId, comments.id),
            eq(commentReactions.userId, ctx.session?.user.id ?? ""),
          ),
        )
        .where(
          input.parentId
            ? and(
                eq(comments.articleId, input.articleId),
                eq(comments.parentId, input.parentId),
              )
            : and(
                eq(comments.articleId, input.articleId),
                isNull(comments.parentId),
              ),
        );

      return commentsWithCounts;
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

      if (
        comment.userId !== ctx.session.user.id &&
        ctx.session.user.role !== "admin"
      ) {
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

      if (comment.userId === ctx.session.user.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You are not allowed to react to your own comment",
        });
      }

      const existingReaction = await ctx.db.query.commentReactions.findFirst({
        where: and(
          eq(commentReactions.commentId, id),
          eq(commentReactions.userId, ctx.session.user.id),
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
        userId: ctx.session.user.id,
        like,
      });
    }),
} satisfies TRPCRouterRecord;
