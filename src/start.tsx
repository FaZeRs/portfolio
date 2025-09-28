import { sentryGlobalServerMiddlewareHandler } from "@sentry/tanstackstart-react";
import { createMiddleware, createStart } from "@tanstack/react-start";

const sentryMiddleware = createMiddleware().server(
  sentryGlobalServerMiddlewareHandler()
);

export const startInstance = createStart(() => {
  return {
    requestMiddleware: [sentryMiddleware],
  };
});
