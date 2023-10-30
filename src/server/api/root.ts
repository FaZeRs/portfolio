import { createTRPCRouter } from "~/server/api/trpc";
import { experienceRouter } from "~/server/api/routers/experience";
import { projectRouter } from "~/server/api/routers/project";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  experience: experienceRouter,
  project: projectRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
