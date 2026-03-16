import { serviceService } from "@acme/api";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod/v4";
import { optionalAuthMiddleware } from "~/lib/auth/middleware";
import { dbMiddleware } from "~/lib/middleware/db";

export const $getAllPublicServices = createServerFn({ method: "GET" })
  .middleware([dbMiddleware])
  .handler(({ context }) => {
    return serviceService.getAllPublic(context.db);
  });

export const $getServiceBySlug = createServerFn({ method: "GET" })
  .middleware([dbMiddleware, optionalAuthMiddleware])
  .inputValidator(z.object({ slug: z.string() }))
  .handler((ctx) => {
    const session = ctx.context.user
      ? { user: { role: ctx.context.user.role ?? "" } }
      : null;
    return serviceService.getBySlug(ctx.context.db, ctx.data, session);
  });
