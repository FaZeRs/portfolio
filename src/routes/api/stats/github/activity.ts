import { json } from "@tanstack/react-start";
import { createAPIFileRoute } from "@tanstack/react-start/api";
import { getGithubActivities } from "~/lib/github";

export const APIRoute = createAPIFileRoute("/api/stats/github/activity")({
  GET: async ({ request, params }) => {
    try {
      const contributions = await getGithubActivities();
      return json(contributions);
    } catch (error) {
      return json({ error: error }, { status: 500 });
    }
  },
});
