import { createTRPCClientFactory } from "@acme/shared/create-trpc-client";
import { createIsomorphicFn } from "@tanstack/react-start";
import { auth } from "./auth/server";
import { getBaseUrl } from "./utils";

const getAuthFn = createIsomorphicFn()
  .server(() => auth)
  .client(() => null);

const getBaseUrlFn = createIsomorphicFn()
  .server(() => null)
  .client(() => getBaseUrl());

export const { makeTRPCClient, useTRPC, TRPCProvider } =
  createTRPCClientFactory({
    source: "web",
    getAuth: () => getAuthFn(),
    getBaseUrl: () => getBaseUrlFn(),
  });
