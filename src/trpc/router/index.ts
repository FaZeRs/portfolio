import { createTRPCRouter } from "~/trpc/init";
import { projectRouter } from "~/trpc/router/project";
import { userRouter } from "~/trpc/router/user";

export const appRouter = createTRPCRouter({
  user: userRouter,
  project: projectRouter,
});

export type AppRouter = typeof appRouter;
