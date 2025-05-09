/// <reference types="vinxi/types/server" />
import { nodeProfilingIntegration } from "@sentry/profiling-node";
import * as Sentry from "@sentry/tanstackstart-react";
import { getRouterManifest } from "@tanstack/react-start/router-manifest";
import { createStartHandler, defaultStreamHandler } from "@tanstack/react-start/server";

import { env } from "~/lib/env.server";
import { createRouter } from "./router";

Sentry.init({
  dsn: env.SENTRY_DSN,
  integrations: [nodeProfilingIntegration()],
  tracesSampleRate: 1.0,
  profileSessionSampleRate: 1.0,
  profileLifecycle: "trace",
});

export default createStartHandler({
  createRouter,
  getRouterManifest,
})(Sentry.wrapStreamHandlerWithSentry(defaultStreamHandler));
