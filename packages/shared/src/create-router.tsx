import { DefaultCatchBoundary } from "@acme/ui/default-catch-boundary";
import { NotFound } from "@acme/ui/not-found";
// biome-ignore lint/performance/noNamespaceImport: valid import
import * as Sentry from "@sentry/tanstackstart-react";
import { QueryCache, QueryClient } from "@tanstack/react-query";
import type { AnyRoute } from "@tanstack/react-router";
import { createRouter as createTanStackRouter } from "@tanstack/react-router";
import { setupRouterSsrQueryIntegration } from "@tanstack/react-router-ssr-query";

interface CreateRouterOptions<TRouteTree extends AnyRoute> {
  routeTree: TRouteTree;
}

export function createRouter<TRouteTree extends AnyRoute>({
  routeTree,
}: CreateRouterOptions<TRouteTree>) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        staleTime: 1000 * 60,
      },
    },
    queryCache: new QueryCache(),
  });

  const router = createTanStackRouter({
    context: { queryClient, user: null },
    routeTree,
    defaultPreload: "intent",
    defaultPreloadStaleTime: 0,
    defaultErrorComponent: DefaultCatchBoundary,
    defaultNotFoundComponent: () => <NotFound />,
    scrollRestoration: true,
    defaultStructuralSharing: true,
  });

  setupRouterSsrQueryIntegration({
    router,
    queryClient,
    handleRedirects: true,
    wrapQueryClient: true,
  });

  if (!router.isServer) {
    Sentry.init({
      dsn: "https://17579a13d5cd498e77df726d6b437274@o173746.ingest.us.sentry.io/4508332499140608",
      integrations: [
        Sentry.tanstackRouterBrowserTracingIntegration(router),
        Sentry.browserTracingIntegration(),
      ],
      tracesSampleRate: 1.0,
      tracePropagationTargets: [
        "localhost",
        // biome-ignore lint/performance/useTopLevelRegex: valid use case
        /^https:\/\/naurislinde\.dev\//,
        // biome-ignore lint/performance/useTopLevelRegex: valid use case
        /^https:\/\/cms\.naurislinde\.dev\//,
      ],
      profileSessionSampleRate: 1.0,
      profileLifecycle: "trace",
      sendDefaultPii: true,
    });
  }

  return router;
}
