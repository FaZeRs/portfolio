import { json } from "@tanstack/react-start";
import { createServerFileRoute } from "@tanstack/react-start/server";
import { getGithubActivities } from "~/lib/github";

export const ServerRoute = createServerFileRoute(
  "/api/stats/github/activity",
).methods({
  GET: async () => {
    try {
      const contributions = await getGithubActivities();
      return json(contributions);
    } catch (error) {
      return json({ error: error }, { status: 500 });
    }
  },
});
