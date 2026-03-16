import { experienceService } from "@acme/api";
import {
  CreateExperienceSchema,
  UpdateExperienceSchema,
} from "@acme/db/schema";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod/v4";
import { authMiddleware } from "~/lib/auth/middleware";
import { dbMiddleware } from "~/lib/middleware/db";
import { sentryMiddleware } from "~/lib/middleware/sentry";

export const $getAllExperiences = createServerFn({ method: "GET" })
  .middleware([sentryMiddleware, dbMiddleware, authMiddleware])
  .handler(({ context }) => {
    return experienceService.getAll(context.db);
  });

export const $getExperienceById = createServerFn({ method: "GET" })
  .middleware([sentryMiddleware, dbMiddleware, authMiddleware])
  .inputValidator(z.object({ id: z.string() }))
  .handler((ctx) => {
    return experienceService.getById(ctx.context.db, ctx.data);
  });

export const $createExperience = createServerFn({ method: "POST" })
  .middleware([sentryMiddleware, dbMiddleware, authMiddleware])
  .inputValidator(CreateExperienceSchema)
  .handler((ctx) => {
    return experienceService.create(ctx.context.db, ctx.data);
  });

export const $updateExperience = createServerFn({ method: "POST" })
  .middleware([sentryMiddleware, dbMiddleware, authMiddleware])
  .inputValidator(UpdateExperienceSchema)
  .handler((ctx) => {
    return experienceService.update(ctx.context.db, ctx.data);
  });

export const $deleteExperience = createServerFn({ method: "POST" })
  .middleware([sentryMiddleware, dbMiddleware, authMiddleware])
  .inputValidator(z.string())
  .handler((ctx) => {
    return experienceService.remove(ctx.context.db, ctx.data);
  });
