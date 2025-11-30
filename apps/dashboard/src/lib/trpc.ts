// biome-ignore lint/performance/noNamespaceImport: valid case
import * as Api from "@acme/api";
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
import { auth } from "./auth/server";
import { env } from "./env/server";
import { getBaseUrl } from "./utils";

export const makeTRPCClient = createIsomorphicFn()
  .server(() =>
    createTRPCClient<Api.AppRouter>({
      links: [
        unstable_localLink({
          router: Api.appRouter,
          transformer: SuperJSON,
          createContext: () => {
            const headers = new Headers(getRequestHeaders());
            headers.set("x-trpc-source", "tanstack-start-server");
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
          url: `${getBaseUrl()}/api/trpc`,
          headers() {
            const headers = new Headers();
            headers.set("x-trpc-source", "tanstack-start-client");
            return headers;
          },
        }),
      ],
    })
  );

export const { useTRPC, TRPCProvider } = createTRPCContext<Api.AppRouter>();
