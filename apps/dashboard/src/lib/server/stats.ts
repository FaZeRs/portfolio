import { statsService } from "@acme/api";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod/v4";
import { authMiddleware } from "~/lib/auth/middleware";
import { dbMiddleware } from "~/lib/middleware/db";
import { sentryMiddleware } from "~/lib/middleware/sentry";

const statsInput = z
  .object({ months: z.number().min(1).max(24).default(6) })
  .optional();

export const $getMonthlyUsers = createServerFn({ method: "GET" })
  .middleware([sentryMiddleware, dbMiddleware, authMiddleware])
  .inputValidator(statsInput)
  .handler((ctx) => {
    return statsService.monthlyUsers(ctx.context.db, ctx.data);
  });

export const $getMonthlyBlogViews = createServerFn({ method: "GET" })
  .middleware([sentryMiddleware, dbMiddleware, authMiddleware])
  .inputValidator(statsInput)
  .handler((ctx) => {
    return statsService.monthlyBlogViews(ctx.context.db, ctx.data);
  });
