import { nodeProfilingIntegration } from "@sentry/profiling-node";
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
  integrations: [nodeProfilingIntegration()],
  tracesSampleRate: 1.0,
  profileSessionSampleRate: 1.0,
  profileLifecycle: "trace",
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
