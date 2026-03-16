import { projectService } from "@acme/api";
import { CreateProjectSchema, UpdateProjectSchema } from "@acme/db/schema";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod/v4";
import { authMiddleware } from "~/lib/auth/middleware";
import { dbMiddleware } from "~/lib/middleware/db";
import { sentryMiddleware } from "~/lib/middleware/sentry";

export const $getAllProjects = createServerFn({ method: "GET" })
  .middleware([sentryMiddleware, dbMiddleware, authMiddleware])
  .handler(({ context }) => {
    return projectService.getAll(context.db);
  });

export const $getProjectById = createServerFn({ method: "GET" })
  .middleware([sentryMiddleware, dbMiddleware, authMiddleware])
  .inputValidator(z.object({ id: z.string() }))
  .handler((ctx) => {
    return projectService.getById(ctx.context.db, ctx.data);
  });

export const $createProject = createServerFn({ method: "POST" })
  .middleware([sentryMiddleware, dbMiddleware, authMiddleware])
  .inputValidator(CreateProjectSchema)
  .handler((ctx) => {
    return projectService.create(ctx.context.db, ctx.data);
  });

export const $updateProject = createServerFn({ method: "POST" })
  .middleware([sentryMiddleware, dbMiddleware, authMiddleware])
  .inputValidator(UpdateProjectSchema)
  .handler((ctx) => {
    return projectService.update(ctx.context.db, ctx.data);
  });

export const $deleteProject = createServerFn({ method: "POST" })
  .middleware([sentryMiddleware, dbMiddleware, authMiddleware])
  .inputValidator(z.string())
  .handler((ctx) => {
    return projectService.remove(ctx.context.db, ctx.data);
  });
