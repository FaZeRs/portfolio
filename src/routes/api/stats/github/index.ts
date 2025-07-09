import { json } from "@tanstack/react-start";
import { createServerFileRoute } from "@tanstack/react-start/server";
import { getGithubStats } from "~/lib/github";

export const ServerRoute = createServerFileRoute("/api/stats/github/").methods({
  GET: async ({ request, params }) => {
    try {
      const { user, repos, starsCount } = (await getGithubStats()) || {};
      return json({ user, repos, starsCount });
    } catch (error) {
      return json({ error: error }, { status: 500 });
    }
  },
});
