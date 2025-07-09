import { nodeProfilingIntegration } from "@sentry/profiling-node";
import * as Sentry from "@sentry/tanstackstart-react";
import {
  createStartHandler,
  defaultStreamHandler,
} from "@tanstack/react-start/server";

import {
  createMiddleware,
  registerGlobalMiddleware,
} from "@tanstack/react-start";
import { env } from "~/lib/env.server";
import { createRouter } from "./router";

Sentry.init({
  dsn: env.VITE_SENTRY_DSN,
  integrations: [nodeProfilingIntegration()],
  tracesSampleRate: 1.0,
  profileSessionSampleRate: 1.0,
  profileLifecycle: "trace",
});

registerGlobalMiddleware({
  middleware: [
    createMiddleware({ type: "function" }).server(
      Sentry.sentryGlobalServerMiddlewareHandler(),
    ),
  ],
});

export default createStartHandler({
  createRouter,
})(Sentry.wrapStreamHandlerWithSentry(defaultStreamHandler));
