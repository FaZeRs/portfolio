import { commentService } from "@acme/api";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod/v4";
import { authMiddleware, optionalAuthMiddleware } from "~/lib/auth/middleware";
import { dbMiddleware } from "~/lib/middleware/db";

// JSONContent schema (recursive)
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

const JSONContentSchema: z.ZodType<z.infer<typeof baseJSONContent>> =
  baseJSONContent.extend({
    content: z.array(z.lazy(() => JSONContentSchema)).optional(),
  });

export const $createComment = createServerFn({ method: "POST" })
  .middleware([dbMiddleware, authMiddleware])
  .inputValidator(
    z.object({
      articleId: z.uuid(),
      content: JSONContentSchema,
      parentId: z.string().optional(),
    })
  )
  .handler((ctx) => {
    return commentService.create(ctx.context.db, ctx.data, ctx.context.user.id);
  });

export const $getAllComments = createServerFn({ method: "GET" })
  .middleware([dbMiddleware, optionalAuthMiddleware])
  .inputValidator(
    z.object({
      articleId: z.uuid(),
      parentId: z.string().optional(),
      sort: z.enum(["asc", "desc"]).optional(),
    })
  )
  .handler(
    // biome-ignore lint/suspicious/noExplicitAny: Drizzle relation types trigger serialization false positive
    (ctx): Promise<any> => {
      return commentService.getAll(
        ctx.context.db,
        ctx.data,
        ctx.context.user?.id
      );
    }
  );

export const $deleteComment = createServerFn({ method: "POST" })
  .middleware([dbMiddleware, authMiddleware])
  .inputValidator(z.object({ id: z.string() }))
  .handler((ctx) => {
    return commentService.remove(
      ctx.context.db,
      ctx.data,
      ctx.context.user.id,
      ctx.context.user.role ?? ""
    );
  });

export const $reactToComment = createServerFn({ method: "POST" })
  .middleware([dbMiddleware, authMiddleware])
  .inputValidator(z.object({ id: z.string(), like: z.boolean() }))
  .handler((ctx) => {
    return commentService.react(ctx.context.db, ctx.data, ctx.context.user.id);
  });
