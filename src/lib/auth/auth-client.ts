import { adminClient, inferAdditionalFields } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import { getBaseUrl } from "~/lib/utils";
import { auth } from "./auth";

const authClient = createAuthClient({
  baseURL: getBaseUrl(),
  plugins: [adminClient(), inferAdditionalFields<typeof auth>()],
});

export default authClient;
