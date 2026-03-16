import type { db as DB } from "@acme/db/client";
import { commentReactions, comments, user } from "@acme/db/schema";
import { and, eq, isNull, sql } from "drizzle-orm";
import { z } from "zod/v4";

type DbClient = typeof DB;

const baseJSONContent = z.object({
  type: z.string().optional(),
  attrs: z.record(z.any(), z.any()).optional(),
  marks: z
    .array(
      z.object({
        type: z.string(),
        attrs: z.record(z.any(), z.any()).optional(),
      })
    )
    .optional(),
  text: z.string().optional(),
});

export const JSONContentSchema: z.ZodType<z.infer<typeof baseJSONContent>> =
  baseJSONContent.extend({
    content: z.array(z.lazy(() => JSONContentSchema)).optional(),
  });

export function create(
  db: DbClient,
  input: {
    articleId: string;
    content: z.infer<typeof JSONContentSchema>;
    parentId?: string;
  },
  userId: string
) {
  return db.insert(comments).values({
    userId,
    articleId: input.articleId,
    content: input.content,
    parentId: input.parentId,
  });
}

export async function getAll(
  db: DbClient,
  input: {
    articleId: string;
    parentId?: string;
    sort?: "asc" | "desc";
  },
  userId?: string
) {
  const commentsWithCounts = await db
    .select({
      comment: comments,
      user,
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
        eq(commentReactions.userId, userId ?? "")
      )
    )
    .where(
      input.parentId
        ? and(
            eq(comments.articleId, input.articleId),
            eq(comments.parentId, input.parentId)
          )
        : and(
            eq(comments.articleId, input.articleId),
            isNull(comments.parentId)
          )
    );

  return commentsWithCounts;
}

export async function remove(
  db: DbClient,
  input: { id: string },
  userId: string,
  userRole: string
) {
  const { id } = input;
  const comment = await db.query.comments.findFirst({
    where: eq(comments.id, id),
  });

  if (!comment) {
    throw new Error("Comment not found");
  }

  if (comment.userId !== userId && userRole !== "admin") {
    throw new Error("You are not allowed to delete this comment");
  }

  return db.delete(comments).where(eq(comments.id, id));
}

export async function react(
  db: DbClient,
  input: { id: string; like: boolean },
  userId: string
) {
  const { id, like: isLike } = input;
  const comment = await db.query.comments.findFirst({
    where: eq(comments.id, id),
  });

  if (!comment) {
    throw new Error("Comment not found");
  }

  if (comment.userId === userId) {
    throw new Error("You are not allowed to react to your own comment");
  }

  const existingReaction = await db.query.commentReactions.findFirst({
    where: and(
      eq(commentReactions.commentId, id),
      eq(commentReactions.userId, userId)
    ),
  });

  if (existingReaction) {
    return db
      .update(commentReactions)
      .set({ like: isLike })
      .where(eq(commentReactions.id, existingReaction.id));
  }

  return db.insert(commentReactions).values({
    commentId: id,
    userId,
    like: isLike,
  });
}
