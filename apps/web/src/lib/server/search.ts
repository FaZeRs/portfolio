import { searchService } from "@acme/api";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod/v4";
import { dbMiddleware } from "~/lib/middleware/db";

export const $search = createServerFn({ method: "GET" })
  .middleware([dbMiddleware])
  .inputValidator(z.object({ query: z.string().min(1).max(100) }))
  .handler((ctx) => {
    return searchService.query(ctx.context.db, ctx.data);
  });
