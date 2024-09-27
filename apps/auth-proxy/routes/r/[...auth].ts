import { Auth } from "@auth/core";
import GitHubProvider from "@auth/core/providers/github";
import { eventHandler, toWebRequest } from "h3";

export default eventHandler(async (event) =>
  Auth(toWebRequest(event), {
    basePath: "/r",
    secret: process.env.AUTH_SECRET,
    trustHost: !!process.env.VERCEL,
    redirectProxyUrl: process.env.AUTH_REDIRECT_PROXY_URL,
    providers: [
      GitHubProvider({
        clientId: process.env.AUTH_GITHUB_ID,
        clientSecret: process.env.AUTH_GITHUB_SECRET,
      }),
    ],
  }),
);
