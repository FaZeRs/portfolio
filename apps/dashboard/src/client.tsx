import {
  browserTracingIntegration,
  init,
  tanstackRouterBrowserTracingIntegration,
} from "@sentry/tanstackstart-react";
import { StartClient } from "@tanstack/react-start/client";
import { StrictMode, startTransition } from "react";
import { hydrateRoot } from "react-dom/client";
import { env } from "~/lib/env/client";
import { getRouter } from "./router";

const router = getRouter();

init({
  dsn: env.VITE_SENTRY_DSN,
  integrations: [
    tanstackRouterBrowserTracingIntegration(router),
    browserTracingIntegration(),
  ],
  tracesSampleRate: 1.0,
  profilesSampleRate: 1.0,
});

startTransition(() => {
  hydrateRoot(
    document,
    <StrictMode>
      <StartClient />
    </StrictMode>
  );
});
