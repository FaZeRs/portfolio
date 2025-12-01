import { createFileRoute } from "@tanstack/react-router";
import { json } from "@tanstack/react-start";
import { getGithubStats } from "~/lib/github";

export const Route = createFileRoute("/api/stats/github/")({
  server: {
    handlers: {
      GET: async () => {
        try {
          const { user, repos, starsCount } = (await getGithubStats()) || {};
          return json({ user, repos, starsCount });
        } catch (error) {
          return json({ error }, { status: 500 });
        }
      },
    },
  },
});
