import { snippetService } from "@acme/api";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod/v4";
import { optionalAuthMiddleware } from "~/lib/auth/middleware";
import { dbMiddleware } from "~/lib/middleware/db";

export const $getAllPublicSnippets = createServerFn({ method: "GET" })
  .middleware([dbMiddleware])
  .handler(({ context }) => {
    return snippetService.getAllPublic(context.db);
  });

export const $getSnippetBySlug = createServerFn({ method: "GET" })
  .middleware([dbMiddleware, optionalAuthMiddleware])
  .inputValidator(z.object({ slug: z.string() }))
  .handler((ctx) => {
    const session = ctx.context.user
      ? { user: { role: ctx.context.user.role ?? "" } }
      : null;
    return snippetService.getBySlug(ctx.context.db, ctx.data, session);
  });
