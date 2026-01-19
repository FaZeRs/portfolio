import { createFileRoute } from "@tanstack/react-router";
import { getGithubActivities } from "~/lib/github";

export const Route = createFileRoute("/api/stats/github/activity")({
  server: {
    handlers: {
      GET: async () => {
        try {
          const contributions = await getGithubActivities();
          return Response.json(contributions);
        } catch (error) {
          return Response.json({ error }, { status: 500 });
        }
      },
    },
  },
});
