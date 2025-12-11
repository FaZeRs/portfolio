import { init as initSentry } from "@sentry/tanstackstart-react";

initSentry({
  dsn: process.env.VITE_SENTRY_DSN,
  tracesSampleRate: 1.0,
  profileSessionSampleRate: 1.0,
  profileLifecycle: "trace",
  sendDefaultPii: true,
});
