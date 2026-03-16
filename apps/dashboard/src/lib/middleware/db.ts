import { db } from "@acme/db/client";
import { createMiddleware } from "@tanstack/react-start";

export const dbMiddleware = createMiddleware().server(({ next }) => {
  return next({ context: { db } });
});
