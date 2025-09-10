/// <reference types="vite/client" />

import { wrapCreateRootRouteWithSentry } from "@sentry/tanstackstart-react";
import { TanStackDevtools } from "@tanstack/react-devtools";
import type { QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtoolsPanel } from "@tanstack/react-query-devtools";
import {
  createRootRouteWithContext,
  HeadContent,
  Outlet,
  Scripts,
} from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { createServerFn } from "@tanstack/react-start";
import { getWebRequest } from "@tanstack/react-start/server";
import type { TRPCOptionsProxy } from "@trpc/tanstack-react-query";
import { Analytics } from "@vercel/analytics/react";
import { Toaster } from "~/components/ui/sonner";
import { ThemeProvider } from "~/components/ui/theme";
import { siteConfig } from "~/lib/config/site";
import { seo } from "~/lib/seo";
import { auth } from "~/lib/server/auth";
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
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      ...seo({
        title: siteConfig.title,
        description: siteConfig.description,
        keywords: siteConfig.keywords,
      }),
    ],
    links: [{ rel: "stylesheet", href: appCss, as: "style", type: "text/css" }],
  }),
  component: RootComponent,
});

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
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
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          disableTransitionOnChange
          enableSystem
        >
          {children}
          <Toaster />
        </ThemeProvider>

        <TanStackDevtools
          config={{
            position: "bottom-left",
          }}
          eventBusConfig={{
            debug: false,
            connectToServerBus: true,
          }}
          plugins={[
            {
              name: "TanStack Query",
              render: <ReactQueryDevtoolsPanel />,
            },
            {
              name: "TanStack Router",
              render: <TanStackRouterDevtoolsPanel />,
            },
          ]}
        />
        <Analytics />
        <Scripts />
      </body>
    </html>
  );
}
