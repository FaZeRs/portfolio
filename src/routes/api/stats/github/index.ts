import { json } from "@tanstack/react-start";
import { createAPIFileRoute } from "@tanstack/react-start/api";
import { getGithubStats } from "~/lib/github";

export const APIRoute = createAPIFileRoute("/api/stats/github")({
  GET: async ({ request, params }) => {
    try {
      const { user, repos, starsCount } = (await getGithubStats()) || {};
      return json({ user, repos, starsCount });
    } catch (error) {
      return json({ error: error }, { status: 500 });
    }
  },
});
