import { blogService } from "@acme/api";
import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { z } from "zod/v4";
import { optionalAuthMiddleware } from "~/lib/auth/middleware";
import { dbMiddleware } from "~/lib/middleware/db";

export const $getAllPublicArticles = createServerFn({ method: "GET" })
  .middleware([dbMiddleware])
  .handler(({ context }) => {
    return blogService.getAllPublic(context.db);
  });

export const $getArticleBySlug = createServerFn({ method: "GET" })
  .middleware([dbMiddleware, optionalAuthMiddleware])
  .inputValidator(z.object({ slug: z.string() }))
  .handler(
    // biome-ignore lint/suspicious/noExplicitAny: Drizzle relation types trigger serialization false positive
    (ctx): Promise<any> => {
      const session = ctx.context.user
        ? { user: { role: ctx.context.user.role ?? "" } }
        : null;
      return blogService.getBySlug(ctx.context.db, ctx.data, session);
    }
  );

export const $likeArticle = createServerFn({ method: "POST" })
  .middleware([dbMiddleware])
  .inputValidator(z.object({ slug: z.string() }))
  .handler((ctx) => {
    return blogService.like(ctx.context.db, ctx.data, getRequest().headers);
  });

export const $isArticleLiked = createServerFn({ method: "GET" })
  .middleware([dbMiddleware])
  .inputValidator(z.object({ slug: z.string() }))
  .handler((ctx) => {
    return blogService.isLiked(ctx.context.db, ctx.data, getRequest().headers);
  });

export const $viewArticle = createServerFn({ method: "POST" })
  .middleware([dbMiddleware])
  .inputValidator(z.object({ slug: z.string() }))
  .handler((ctx) => {
    return blogService.view(ctx.context.db, ctx.data);
  });
