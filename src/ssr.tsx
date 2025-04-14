/// <reference types="vinxi/types/server" />
import * as Sentry from "@sentry/tanstackstart-react";
import { getRouterManifest } from "@tanstack/react-start/router-manifest";
import { createStartHandler, defaultStreamHandler } from "@tanstack/react-start/server";

import { createRouter } from "./router";

Sentry.init({
  dsn: import.meta.env.SENTRY_DSN,
});

export default createStartHandler({
  createRouter,
  getRouterManifest,
})(Sentry.wrapStreamHandlerWithSentry(defaultStreamHandler));
