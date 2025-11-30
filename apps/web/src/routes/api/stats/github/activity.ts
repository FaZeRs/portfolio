import { createFileRoute } from "@tanstack/react-router";
import { json } from "@tanstack/react-start";
import { getGithubActivities } from "~/lib/github";

export const Route = createFileRoute("/api/stats/github/activity")({
  server: {
    handlers: {
      GET: async () => {
        try {
          const contributions = await getGithubActivities();
          return json(contributions);
        } catch (error) {
          return json({ error }, { status: 500 });
        }
      },
    },
  },
});
