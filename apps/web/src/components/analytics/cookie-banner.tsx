import { Button } from "@acme/ui/button";
import { usePostHog } from "@posthog/react";
import { AnimatePresence, motion } from "framer-motion";
import { Cookie, X } from "lucide-react";
import { useState } from "react";

export function CookieBanner() {
  const posthog = usePostHog();
  const [consentGiven, setConsentGiven] = useState(
    posthog.get_explicit_consent_status()
  );

  const handleAcceptCookies = () => {
    posthog.opt_in_capturing();
    setConsentGiven("granted");
  };

  const handleDeclineCookies = () => {
    posthog.opt_out_capturing();
    setConsentGiven("denied");
  };

  return (
    <AnimatePresence>
      <motion.div
        animate={{ y: 0, opacity: 1 }}
        className="fixed inset-x-0 bottom-0 z-50 p-4"
        exit={{ y: 100, opacity: 0 }}
        initial={{ y: 100, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        {consentGiven === "pending" && (
          <div className="mx-auto max-w-5xl">
            <div className="relative flex flex-col items-center justify-between gap-4 rounded-xl border border-border/50 bg-background/95 p-4 shadow-lg backdrop-blur-md sm:flex-row sm:gap-6 sm:p-5">
              <button
                aria-label="Close cookie banner"
                className="absolute top-2 right-2 rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground sm:hidden"
                onClick={handleDeclineCookies}
                type="button"
              >
                <X className="size-4" />
              </button>

              <div className="flex items-start gap-3 pr-6 sm:pr-0">
                <div className="hidden rounded-lg bg-primary/10 p-2 sm:block">
                  <Cookie className="size-5 text-primary" />
                </div>
                <div className="space-y-1">
                  <p className="font-medium text-foreground text-sm">
                    Cookie Preferences
                  </p>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    We use cookies to enhance your experience and analyze site
                    traffic. You can decline for anonymous tracking.
                  </p>
                </div>
              </div>

              <div className="flex w-full shrink-0 gap-2 sm:w-auto">
                <Button
                  className="flex-1 sm:flex-none"
                  onClick={handleDeclineCookies}
                  size="sm"
                  variant="outline"
                >
                  Decline
                </Button>
                <Button
                  className="flex-1 sm:flex-none"
                  onClick={handleAcceptCookies}
                  size="sm"
                >
                  Accept
                </Button>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
