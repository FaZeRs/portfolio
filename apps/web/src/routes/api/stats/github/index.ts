import { createFileRoute } from "@tanstack/react-router";
import { getGithubStats } from "~/lib/github";

export const Route = createFileRoute("/api/stats/github/")({
  server: {
    handlers: {
      GET: async () => {
        try {
          const { user, repos, starsCount } = (await getGithubStats()) || {};
          return Response.json({ user, repos, starsCount });
        } catch (error) {
          return Response.json({ error }, { status: 500 });
        }
      },
    },
  },
});
