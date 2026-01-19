import posthog from "posthog-js";
import { type ReactNode, useEffect, useRef } from "react";
import type { ConsentStatus } from "~/contexts/cookie-consent";
import { useCookieConsent } from "~/contexts/cookie-consent";
import { env } from "~/lib/env/client";

type PostHogProviderProps = {
  readonly children: ReactNode;
};

function initializePostHog() {
  posthog.init(env.VITE_POSTHOG_KEY, {
    api_host: env.VITE_POSTHOG_HOST,
    cookieless_mode: "on_reject",
    capture_pageview: true,
    capture_pageleave: true,
    autocapture: true,
    session_recording: {
      maskAllInputs: true,
      maskTextSelector: "[data-mask]",
    },
  });
}

function updatePostHogConsent(consentStatus: ConsentStatus) {
  if (consentStatus === "accepted") {
    posthog.opt_in_capturing();
  } else {
    posthog.opt_out_capturing();
  }
}

export function PostHogProvider({ children }: PostHogProviderProps) {
  const { consentStatus, isHydrated } = useCookieConsent();
  const isInitialized = useRef(false);

  useEffect(() => {
    if (!isInitialized.current) {
      initializePostHog();
      isInitialized.current = true;
    }
  }, []);

  useEffect(() => {
    if (
      !(isHydrated && isInitialized.current) ||
      consentStatus === "undecided"
    ) {
      return;
    }

    updatePostHogConsent(consentStatus);
  }, [consentStatus, isHydrated]);

  return <>{children}</>;
}
