import { processScheduledSocialPosts } from "@acme/marketing";
import { createFileRoute } from "@tanstack/react-router";
import { processScheduledEmailCampaigns } from "../../../../../../packages/marketing/src";

export const Route = createFileRoute("/api/cron/process-campaigns")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          // Verify cron secret for security
          const cronSecret = process.env.CRON_SECRET;
          const authHeader = request.headers.get("authorization");

          if (cronSecret) {
            const providedSecret = authHeader?.replace("Bearer ", "");
            if (providedSecret !== cronSecret) {
              return Response.json({ error: "Unauthorized" }, { status: 401 });
            }
          }

          // Process scheduled email campaigns and social posts
          await Promise.all([
            processScheduledEmailCampaigns(),
            processScheduledSocialPosts(),
          ]);

          return Response.json(
            {
              success: true,
              message: "Scheduled campaigns and posts processed",
              timestamp: new Date().toISOString(),
            },
            { status: 200 }
          );
        } catch (error) {
          console.error("Error processing scheduled campaigns:", error);
          return Response.json(
            {
              error: "Internal server error",
              message: error instanceof Error ? error.message : "Unknown error",
            },
            { status: 500 }
          );
        }
      },
    },
  },
});
