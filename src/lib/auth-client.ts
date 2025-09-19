import {
  adminClient,
  inferAdditionalFields,
  oneTapClient,
} from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import { getBaseUrl } from "~/lib/utils";
import { env } from "./env.client";
import { auth } from "./server/auth";

const authClient = createAuthClient({
  baseURL: getBaseUrl(),
  plugins: [
    adminClient(),
    inferAdditionalFields<typeof auth>(),
    oneTapClient({
      clientId: env.VITE_GOOGLE_CLIENT_ID ?? "",

      autoSelect: true,
      cancelOnTapOutside: true,
      context: "signin",
    }),
  ],
});

export default authClient;
