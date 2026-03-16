import { db } from "@acme/db/client";
import { createMiddleware } from "@tanstack/react-start";
import { sentryMiddleware } from "./sentry";

export const dbMiddleware = createMiddleware()
  .middleware([sentryMiddleware])
  .server(({ next }) => {
    return next({ context: { db } });
  });
