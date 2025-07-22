import { createTRPCRouter } from "~/trpc/init";
import { blogRouter } from "~/trpc/router/blog";
import { experienceRouter } from "~/trpc/router/experience";
import { projectRouter } from "~/trpc/router/project";
import { snippetRouter } from "~/trpc/router/snippet";
import { userRouter } from "~/trpc/router/user";

export const appRouter = createTRPCRouter({
  user: userRouter,
  project: projectRouter,
  experience: experienceRouter,
  snippet: snippetRouter,
  blog: blogRouter,
});

export type AppRouter = typeof appRouter;
