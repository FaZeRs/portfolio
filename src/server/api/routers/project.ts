import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const projectRouter = createTRPCRouter({
  list: publicProcedure.query(({ ctx }) => {
    return ctx.db.query.projects.findMany({
      where: (projects, { eq }) => eq(projects.published, true),
      orderBy: (projects, { asc }) => [asc(projects.createdAt)],
    });
  }),
});
