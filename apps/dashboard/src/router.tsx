import { createRouter } from "@acme/shared/create-router";
import { createTRPC } from "@acme/shared/create-trpc";
import { auth } from "~/lib/auth/server";
import { env } from "~/lib/env/server";
import { TRPCProvider } from "~/lib/trpc";
import { getBaseUrl } from "~/lib/utils";
import { routeTree } from "./routeTree.gen";

export function getRouter() {
  const makeTRPCClient = createTRPC({
    sourceName: "dashboard",
    auth,
    env,
    baseUrl: getBaseUrl(),
  });
  return createRouter<typeof routeTree>({
    routeTree,
    makeTRPCClient,
    TRPCProvider,
  });
}
