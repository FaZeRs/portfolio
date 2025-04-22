import { adminClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import { getBaseUrl } from "~/lib/utils";

const authClient = createAuthClient({
  baseURL: getBaseUrl(),
  plugins: [adminClient()],
});

export default authClient;
