import { blogRouter } from "./router/blog";
import { commentRouter } from "./router/comment";
import { emailMarketingRouter } from "./router/email-marketing";
import { experienceRouter } from "./router/experience";
import { guestbookRouter } from "./router/guestbook";
import { projectRouter } from "./router/project";
import { searchRouter } from "./router/search";
import { serviceRouter } from "./router/service";
import { snippetRouter } from "./router/snippet";
import { socialMarketingRouter } from "./router/social-marketing";
import { statsRouter } from "./router/stats";
import { userRouter } from "./router/user";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  user: userRouter,
  project: projectRouter,
  experience: experienceRouter,
  snippet: snippetRouter,
  blog: blogRouter,
  comment: commentRouter,
  stats: statsRouter,
  guestbook: guestbookRouter,
  service: serviceRouter,
  search: searchRouter,
  emailMarketing: emailMarketingRouter,
  socialMarketing: socialMarketingRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
