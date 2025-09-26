import { trpcMiddleware } from "@sentry/node";
import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";

import { auth } from "~/lib/auth/auth";
import { db } from "~/lib/db";

export const createTRPCContext = async (request: Request) => {
  const headers = request.headers;
  const session = await auth.api.getSession({
    headers,
  });

  return {
    db,
    session,
    headers,
  };
};

export const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
});

export const createTRPCRouter = t.router;

const sentryMiddleware = t.middleware(
  trpcMiddleware({
    attachRpcInput: true,
  })
);

const enforceUserIsAuthenticated = t.middleware(({ ctx, next }) => {
  if (!ctx.session?.user) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  return next({
    ctx: {
      session: { ...ctx.session, user: ctx.session.user },
    },
  });
});

export const publicProcedure = t.procedure.use(sentryMiddleware);
export const protectedProcedure = t.procedure
  .use(sentryMiddleware)
  .use(enforceUserIsAuthenticated);
