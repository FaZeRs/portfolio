import { projectService } from "@acme/api";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod/v4";
import { optionalAuthMiddleware } from "~/lib/auth/middleware";
import { dbMiddleware } from "~/lib/middleware/db";

export const $getAllPublicProjects = createServerFn({ method: "GET" })
  .middleware([dbMiddleware])
  .handler(({ context }) => {
    return projectService.getAllPublic(context.db);
  });

export const $getProjectBySlug = createServerFn({ method: "GET" })
  .middleware([dbMiddleware, optionalAuthMiddleware])
  .inputValidator(z.object({ slug: z.string() }))
  .handler((ctx) => {
    const session = ctx.context.user
      ? { user: { role: ctx.context.user.role ?? "" } }
      : null;
    return projectService.getBySlug(ctx.context.db, ctx.data, session);
  });
