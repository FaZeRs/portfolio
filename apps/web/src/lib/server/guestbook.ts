import { guestbookService } from "@acme/api";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod/v4";
import { authMiddleware } from "~/lib/auth/middleware";
import { dbMiddleware } from "~/lib/middleware/db";

export const $getAllGuestbookEntries = createServerFn({ method: "GET" })
  .middleware([dbMiddleware])
  .handler(({ context }) => {
    return guestbookService.getAll(context.db);
  });

export const $createGuestbookEntry = createServerFn({ method: "POST" })
  .middleware([dbMiddleware, authMiddleware])
  .inputValidator(
    z.object({
      message: z
        .string()
        .trim()
        .min(1, "Message cannot be empty")
        .max(500, "Message is too long"),
    })
  )
  .handler((ctx) => {
    return guestbookService.create(
      ctx.context.db,
      ctx.data,
      ctx.context.user.id
    );
  });

export const $deleteGuestbookEntry = createServerFn({ method: "POST" })
  .middleware([dbMiddleware, authMiddleware])
  .inputValidator(z.object({ id: z.string() }))
  .handler((ctx) => {
    return guestbookService.remove(
      ctx.context.db,
      ctx.data,
      ctx.context.user.id,
      ctx.context.user.role ?? ""
    );
  });
