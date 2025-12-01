// biome-ignore lint/performance/noNamespaceImport: valid case
import * as Api from "@acme/api";
import type { Auth } from "@acme/auth";
import { createIsomorphicFn } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";
import {
  createTRPCClient,
  httpBatchStreamLink,
  loggerLink,
  unstable_localLink,
} from "@trpc/client";
import SuperJSON from "superjson";

type CreateTRPCOptions = {
  sourceName: string;
  auth: Auth;
  env: {
    NODE_ENV: string;
  };
  baseUrl: string;
};

export function createTRPC({
  sourceName,
  auth,
  env,
  baseUrl,
}: CreateTRPCOptions) {
  return createIsomorphicFn()
    .server(() =>
      createTRPCClient<Api.AppRouter>({
        links: [
          unstable_localLink({
            router: Api.appRouter,
            transformer: SuperJSON,
            createContext: () => {
              const headers = new Headers(getRequestHeaders());
              headers.set("x-trpc-source", sourceName);
              return Api.createTRPCContext({ auth, headers });
            },
          }),
        ],
      })
    )
    .client(() =>
      createTRPCClient<Api.AppRouter>({
        links: [
          loggerLink({
            enabled: (op) =>
              env.NODE_ENV === "development" ||
              (op.direction === "down" && op.result instanceof Error),
          }),
          httpBatchStreamLink({
            transformer: SuperJSON,
            url: `${baseUrl}/api/trpc`,
            headers() {
              const headers = new Headers();
              headers.set("x-trpc-source", sourceName);
              return headers;
            },
          }),
        ],
      })
    );
}
