/// <reference types="vite/client" />

import { wrapCreateRootRouteWithSentry } from "@sentry/tanstackstart-react";
import type { QueryClient } from "@tanstack/react-query";
import {
  createRootRouteWithContext,
  HeadContent,
  Outlet,
  Scripts,
} from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { getWebRequest } from "@tanstack/react-start/server";
import type { TRPCOptionsProxy } from "@trpc/tanstack-react-query";
import { Analytics } from "@vercel/analytics/react";
import { DevtoolsComponent } from "~/components/dev-tools";
import { Toaster } from "~/components/ui/sonner";
import { ThemeProvider } from "~/components/ui/theme-provider";
import { siteConfig } from "~/lib/config/site";
import { seo } from "~/lib/seo";
import { auth } from "~/lib/server/auth";
import {
  createWebSiteSchema,
  generateStructuredData,
} from "~/lib/structured-data";
import appCss from "~/lib/styles/app.css?url";
import { AppRouter } from "~/trpc/router";
import "unfonts.css";

const getUser = createServerFn({ method: "GET" }).handler(async () => {
  // biome-ignore lint: getWebRequest is not undefined
  const { headers } = getWebRequest()!;
  const session = await auth.api.getSession({ headers });

  return session?.user ?? null;
});

export const Route = wrapCreateRootRouteWithSentry(createRootRouteWithContext)<{
  queryClient: QueryClient;
  trpc: TRPCOptionsProxy<AppRouter>;
  user: Awaited<ReturnType<typeof getUser>>;
}>()({
  beforeLoad: async ({ context }) => {
    const user = await context.queryClient.ensureQueryData({
      queryKey: ["user"],
      queryFn: ({ signal }) => getUser({ signal }),
      revalidateIfStale: true,
    }); // we're using react-query for caching, see router.tsx
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
