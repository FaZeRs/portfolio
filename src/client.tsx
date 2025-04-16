/// <reference types="vinxi/types/client" />
import * as Sentry from "@sentry/tanstackstart-react";
import { StartClient } from "@tanstack/react-start";
import { StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";

import { createRouter } from "./router";

const router = createRouter();

Sentry.init({
  dsn: import.meta.env.SENTRY_DSN,
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.browserProfilingIntegration(),
  ],
  tracesSampleRate: 1.0,
  tracePropagationTargets: ["localhost", /^https:\/\/naurislinde\.dev\/api/],
  profilesSampleRate: 1.0,
});

hydrateRoot(
  document,
  <StrictMode>
    <StartClient router={router} />
  </StrictMode>,
);
