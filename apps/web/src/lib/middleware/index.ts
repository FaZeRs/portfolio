import { createMiddleware } from "@tanstack/react-start";
import { authMiddleware } from "~/lib/auth/middleware";
import { dbMiddleware } from "./db";
import { sentryMiddleware } from "./sentry";

export const publicMiddleware = createMiddleware()
  .middleware([sentryMiddleware, dbMiddleware])
  .server(({ next }) => next());

export const protectedMiddleware = createMiddleware()
  .middleware([sentryMiddleware, dbMiddleware, authMiddleware])
  .server(({ next }) => next());
