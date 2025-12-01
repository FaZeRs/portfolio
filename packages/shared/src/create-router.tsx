import type * as Api from "@acme/api";
import { DefaultCatchBoundary } from "@acme/ui/default-catch-boundary";
import { NotFound } from "@acme/ui/not-found";
import { QueryCache, QueryClient } from "@tanstack/react-query";
import type { AnyRoute } from "@tanstack/react-router";
import { createRouter as createTanStackRouter } from "@tanstack/react-router";
import { setupRouterSsrQueryIntegration } from "@tanstack/react-router-ssr-query";
import { TRPCClient } from "@trpc/client";
import { createTRPCOptionsProxy } from "@trpc/tanstack-react-query";
import superjson from "superjson";

type CreateRouterOptions<TRouteTree extends AnyRoute> = {
  routeTree: TRouteTree;
  makeTRPCClient: () => TRPCClient<Api.AppRouter>;
  TRPCProvider: React.ComponentType<{
    queryClient: QueryClient;
    trpcClient: TRPCClient<Api.AppRouter>;
    children: React.ReactNode;
  }>;
};

export function createRouter<TRouteTree extends AnyRoute>({
  routeTree,
  makeTRPCClient,
  TRPCProvider,
}: CreateRouterOptions<TRouteTree>) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        staleTime: 1000 * 60,
      },
      dehydrate: { serializeData: superjson.serialize },
      hydrate: { deserializeData: superjson.deserialize },
    },
    queryCache: new QueryCache(),
  });

  const trpcClient = makeTRPCClient();
  const trpc = createTRPCOptionsProxy({
    client: trpcClient,
    queryClient,
  });

  const router = createTanStackRouter({
    context: { queryClient, trpc, user: null },
    routeTree,
    defaultPreload: "intent",
    defaultPreloadStaleTime: 0,
    defaultErrorComponent: DefaultCatchBoundary,
    defaultNotFoundComponent: () => <NotFound />,
    scrollRestoration: true,
    defaultStructuralSharing: true,
    Wrap: (props) => (
      <TRPCProvider
        queryClient={queryClient}
        trpcClient={trpcClient}
        {...props}
      />
    ),
  });

  setupRouterSsrQueryIntegration({
    router,
    queryClient,
    handleRedirects: true,
    wrapQueryClient: true,
  });

  return router;
}
