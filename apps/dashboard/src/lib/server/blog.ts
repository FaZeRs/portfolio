import { blogService } from "@acme/api";
import { CreateArticleSchema, UpdateArticleSchema } from "@acme/db/schema";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod/v4";
import { authMiddleware } from "~/lib/auth/middleware";
import { dbMiddleware } from "~/lib/middleware/db";
import { sentryMiddleware } from "~/lib/middleware/sentry";

export const $getAllArticles = createServerFn({ method: "GET" })
  .middleware([sentryMiddleware, dbMiddleware, authMiddleware])
  .handler(({ context }) => {
    return blogService.getAll(context.db);
  });

export const $getArticleById = createServerFn({ method: "GET" })
  .middleware([sentryMiddleware, dbMiddleware, authMiddleware])
  .inputValidator(z.object({ id: z.string() }))
  .handler((ctx) => {
    return blogService.getById(ctx.context.db, ctx.data);
  });

export const $createArticle = createServerFn({ method: "POST" })
  .middleware([sentryMiddleware, dbMiddleware, authMiddleware])
  .inputValidator(CreateArticleSchema)
  .handler((ctx) => {
    return blogService.create(ctx.context.db, ctx.data);
  });

export const $updateArticle = createServerFn({ method: "POST" })
  .middleware([sentryMiddleware, dbMiddleware, authMiddleware])
  .inputValidator(UpdateArticleSchema)
  .handler((ctx) => {
    return blogService.update(ctx.context.db, ctx.data);
  });

export const $deleteArticle = createServerFn({ method: "POST" })
  .middleware([sentryMiddleware, dbMiddleware, authMiddleware])
  .inputValidator(z.string())
  .handler((ctx) => {
    return blogService.remove(ctx.context.db, ctx.data);
  });
