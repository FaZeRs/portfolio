import { experienceService } from "@acme/api";
import { createServerFn } from "@tanstack/react-start";
import { dbMiddleware } from "~/lib/middleware/db";

export const $getAllPublicExperiences = createServerFn({ method: "GET" })
  .middleware([dbMiddleware])
  .handler(({ context }) => {
    return experienceService.getAllPublic(context.db);
  });
