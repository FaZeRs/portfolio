import { init as initSentry } from "@sentry/tanstackstart-react";

initSentry({
  dsn: "https://17579a13d5cd498e77df726d6b437274@o173746.ingest.us.sentry.io/4508332499140608",
  tracesSampleRate: 1.0,
  tracePropagationTargets: ["localhost", /^https:\/\/naurislinde\.dev\//],
  profileSessionSampleRate: 1.0,
  profileLifecycle: "trace",
  sendDefaultPii: true,
});
