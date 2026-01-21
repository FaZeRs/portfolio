/// <reference types="vite/client" />

import { AppRouter } from "@acme/api";
import { DevtoolsComponent } from "@acme/shared/dev-tools";
import { ThemeProvider, useTheme } from "@acme/shared/theme-provider";
import { Toaster } from "@acme/ui/sonner";
import { PostHogProvider } from "@posthog/react";
import type { QueryClient } from "@tanstack/react-query";
import {
  ClientOnly,
  createRootRouteWithContext,
  HeadContent,
  Outlet,
  Scripts,
} from "@tanstack/react-router";
import type { TRPCOptionsProxy } from "@trpc/tanstack-react-query";
import posthog from "posthog-js";
import { CookieBanner } from "~/components/analytics/cookie-banner";
import { AuthQueryResult, authQueryOptions } from "~/lib/auth/queries";
import { env } from "~/lib/env/client";
import appCss from "~/styles.css?url";

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient;
  trpc: TRPCOptionsProxy<AppRouter>;
  user: AuthQueryResult;
}>()({
  beforeLoad: async ({ context }) => {
    const user = await context.queryClient.ensureQueryData({
      ...authQueryOptions(),
      revalidateIfStale: true,
    });
    return { user };
  },
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
    ],
    links: [{ rel: "stylesheet", href: appCss, as: "style", type: "text/css" }],
  }),
  component: RootComponent,
});

posthog.init(env.VITE_POSTHOG_KEY, {
  api_host: env.VITE_POSTHOG_HOST,
  defaults: "2025-11-30",
  cookieless_mode: "on_reject",
  disable_external_dependency_loading: true,
});

function RootComponent() {
  return (
    <ThemeProvider>
      <RootDocument>
        <Outlet />
      </RootDocument>
    </ThemeProvider>
  );
}

function RootDocument({ children }: { readonly children: React.ReactNode }) {
  const { resolvedTheme } = useTheme();
  return (
    // suppress since we're updating the "dark" class in a custom script below
    <html className="scroll-smooth" lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body className="min-h-screen bg-background font-sans text-foreground antialiased">
        <PostHogProvider client={posthog}>
          {children}
          <Toaster resolvedTheme={resolvedTheme} />

          {import.meta.env.DEV && <DevtoolsComponent />}
          <ClientOnly>
            <CookieBanner />
          </ClientOnly>
          <Scripts />
        </PostHogProvider>
      </body>
    </html>
  );
}
