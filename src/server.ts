import { init, wrapStreamHandlerWithSentry } from "@sentry/tanstackstart-react";
import {
  createStartHandler,
  defaultStreamHandler,
} from "@tanstack/react-start/server";
import { env } from "~/lib/env/server";

init({
  dsn: env.VITE_SENTRY_DSN,
  integrations: [],
  tracesSampleRate: 1.0,
  profileSessionSampleRate: 1.0,
  profileLifecycle: "trace",
  sendDefaultPii: true,
});

const fetch = createStartHandler(
  wrapStreamHandlerWithSentry(defaultStreamHandler)
);

export default {
  fetch,
};
