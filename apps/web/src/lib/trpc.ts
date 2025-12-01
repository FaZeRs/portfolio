// biome-ignore lint/performance/noNamespaceImport: valid case
import * as Api from "@acme/api";

import { createTRPCContext } from "@trpc/tanstack-react-query";

export const { useTRPC, TRPCProvider } = createTRPCContext<Api.AppRouter>();
