/// <reference types="vinxi/types/client" />
import * as Sentry from "@sentry/tanstackstart-react";
import { StartClient } from "@tanstack/react-start";
import { StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";

import { env } from "~/lib/env.client";
import { createRouter } from "./router";

const router = createRouter();

Sentry.init({
  dsn: env.VITE_SENTRY_DSN,
  integrations: [
    Sentry.tanstackRouterBrowserTracingIntegration(router),
    Sentry.browserTracingIntegration(),
  ],
  tracesSampleRate: 1.0,
  profilesSampleRate: 1.0,
});

hydrateRoot(
  document,
  <StrictMode>
    <StartClient router={router} />
  </StrictMode>,
);
