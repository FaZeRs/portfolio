import { createRouter } from "@acme/shared/create-router";
import { makeTRPCClient, TRPCProvider } from "~/lib/trpc";
import { routeTree } from "./routeTree.gen";

export function getRouter() {
  return createRouter<typeof routeTree>({
    routeTree,
    makeTRPCClient,
    TRPCProvider,
  });
}
