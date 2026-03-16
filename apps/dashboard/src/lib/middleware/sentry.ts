// biome-ignore lint/performance/noNamespaceImport: Sentry SDK requires namespace import
import * as Sentry from "@sentry/tanstackstart-react";
import { createMiddleware } from "@tanstack/react-start";

export const sentryMiddleware = createMiddleware().server(({ next }) => {
  return Sentry.startSpan(
    { name: "server-function", op: "function" },
    async () => {
      try {
        return await next();
      } catch (error) {
        Sentry.captureException(error);
        throw error;
      }
    }
  );
});
