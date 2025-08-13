import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";

import { auth } from "~/lib/server/auth";
import { db } from "~/lib/server/db";

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

export const publicProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(enforceUserIsAuthenticated);
