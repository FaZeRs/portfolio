import type { AppRouter } from "@acme/api";
import {
  appRouter,
  createTRPCContext as createApiTRPCContext,
} from "@acme/api";
import type { Auth } from "@acme/auth";
import { createIsomorphicFn } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";
import {
  createTRPCClient,
  httpBatchStreamLink,
  loggerLink,
  unstable_localLink,
} from "@trpc/client";
import { createTRPCContext } from "@trpc/tanstack-react-query";
import SuperJSON from "superjson";

type CreateTRPCClientOptions = {
  source: "web" | "dashboard";
  getAuth: () => Auth | null;
  getBaseUrl: () => string | null;
};

/**
 * Creates an isomorphic tRPC client that works on both server and client
 */
export function createTRPCClientFactory(options: CreateTRPCClientOptions) {
  const { source, getAuth, getBaseUrl } = options;

  const nodeEnv =
    typeof process !== "undefined" ? process.env.NODE_ENV : "production";

  const makeTRPCClient = createIsomorphicFn()
    .server(() =>
      createTRPCClient<AppRouter>({
        links: [
          unstable_localLink({
            router: appRouter,
            transformer: SuperJSON,
            createContext: () => {
              const headers = new Headers(getRequestHeaders());
              headers.set("x-trpc-source", source);
              // biome-ignore lint/style/noNonNullAssertion: auth is guaranteed to be non-null on the server
              return createApiTRPCContext({ auth: getAuth()!, headers });
            },
          }),
        ],
      })
    )
    .client(() =>
      createTRPCClient<AppRouter>({
        links: [
          loggerLink({
            enabled: (op) =>
              nodeEnv === "development" ||
              (op.direction === "down" && op.result instanceof Error),
          }),
          httpBatchStreamLink({
            transformer: SuperJSON,
            url: `${getBaseUrl()}/api/trpc`,
            headers() {
              const headers = new Headers();
              headers.set("x-trpc-source", source);
              return headers;
            },
          }),
        ],
      })
    );

  const { useTRPC, TRPCProvider } = createTRPCContext<AppRouter>();

  return { makeTRPCClient, useTRPC, TRPCProvider };
}
