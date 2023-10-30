import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const experienceRouter = createTRPCRouter({
  list: publicProcedure.query(({ ctx }) => {
    return ctx.db.query.experiences.findMany({
      where: (experiences, { eq }) => eq(experiences.published, true),
      orderBy: (experiences, { desc }) => [desc(experiences.startDate)],
    });
  }),
});
