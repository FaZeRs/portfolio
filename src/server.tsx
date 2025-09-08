import {
  init,
  sentryGlobalServerMiddlewareHandler,
  wrapStreamHandlerWithSentry,
} from "@sentry/tanstackstart-react";
import {
  createMiddleware,
  registerGlobalMiddleware,
} from "@tanstack/react-start";
import {
  createStartHandler,
  defaultStreamHandler,
} from "@tanstack/react-start/server";
import { env } from "~/lib/env.server";
import { createRouter } from "./router";

init({
  dsn: env.VITE_SENTRY_DSN,
  integrations: [],
  tracesSampleRate: 1.0,
  profileSessionSampleRate: 1.0,
  profileLifecycle: "trace",
  sendDefaultPii: true,
});

registerGlobalMiddleware({
  middleware: [
    createMiddleware({ type: "function" }).server(
      sentryGlobalServerMiddlewareHandler()
    ),
  ],
});

export default createStartHandler({
  createRouter,
})(wrapStreamHandlerWithSentry(defaultStreamHandler));
