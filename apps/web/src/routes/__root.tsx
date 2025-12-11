/// <reference types="vite/client" />

import { AppRouter } from "@acme/api";
import { siteConfig } from "@acme/config";
import { DevtoolsComponent } from "@acme/shared/dev-tools";
import { Toaster } from "@acme/ui/sonner";
import { ThemeProvider } from "@acme/ui/theme-provider";
import type { QueryClient } from "@tanstack/react-query";
import {
  createRootRouteWithContext,
  HeadContent,
  Outlet,
  Scripts,
} from "@tanstack/react-router";
import type { TRPCOptionsProxy } from "@trpc/tanstack-react-query";
import { Analytics } from "@vercel/analytics/react";
import { AuthQueryResult, authQueryOptions } from "~/lib/auth/queries";
import { seo } from "~/lib/seo";
import {
  createWebSiteSchema,
  generateStructuredData,
} from "~/lib/structured-data";
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
  head: () => {
    const seoData = seo({
      title: siteConfig.title,
      description: siteConfig.description,
      keywords: siteConfig.keywords,
    });
    const websiteSchema = generateStructuredData(createWebSiteSchema());

    return {
      meta: [
        {
          charSet: "utf-8",
        },
        {
          name: "viewport",
          content: "width=device-width, initial-scale=1",
        },
        ...seoData.meta,
      ],
      links: [
        { rel: "stylesheet", href: appCss, as: "style", type: "text/css" },
      ],
      scripts: [
        {
          type: "application/ld+json",
          children: websiteSchema,
        },
      ],
    };
  },
  component: RootComponent,
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
  return (
    // suppress since we're updating the "dark" class in a custom script below
    <html className="scroll-smooth" lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body className="min-h-screen bg-background font-sans text-foreground antialiased">
        {children}
        <Toaster />

        {import.meta.env.DEV && <DevtoolsComponent />}
        <Analytics />
        <Scripts />
      </body>
    </html>
  );
}
