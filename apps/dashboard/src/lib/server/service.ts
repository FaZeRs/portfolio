import { serviceService } from "@acme/api";
import { CreateServiceSchema, UpdateServiceSchema } from "@acme/db/schema";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod/v4";
import { authMiddleware } from "~/lib/auth/middleware";
import { dbMiddleware } from "~/lib/middleware/db";
import { sentryMiddleware } from "~/lib/middleware/sentry";

export const $getAllServices = createServerFn({ method: "GET" })
  .middleware([sentryMiddleware, dbMiddleware, authMiddleware])
  .handler(({ context }) => {
    return serviceService.getAll(context.db);
  });

export const $getServiceById = createServerFn({ method: "GET" })
  .middleware([sentryMiddleware, dbMiddleware, authMiddleware])
  .inputValidator(z.object({ id: z.string() }))
  .handler((ctx) => {
    return serviceService.getById(ctx.context.db, ctx.data);
  });

export const $createService = createServerFn({ method: "POST" })
  .middleware([sentryMiddleware, dbMiddleware, authMiddleware])
  .inputValidator(CreateServiceSchema)
  .handler((ctx) => {
    return serviceService.create(ctx.context.db, ctx.data);
  });

export const $updateService = createServerFn({ method: "POST" })
  .middleware([sentryMiddleware, dbMiddleware, authMiddleware])
  .inputValidator(UpdateServiceSchema)
  .handler((ctx) => {
    return serviceService.update(ctx.context.db, ctx.data);
  });

export const $deleteService = createServerFn({ method: "POST" })
  .middleware([sentryMiddleware, dbMiddleware, authMiddleware])
  .inputValidator(z.string())
  .handler((ctx) => {
    return serviceService.remove(ctx.context.db, ctx.data);
  });
