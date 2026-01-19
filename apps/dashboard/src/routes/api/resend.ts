import { db } from "@acme/db/client";
import {
  emailCampaigns,
  emailSubscribers,
  emailTracking,
} from "@acme/db/schema";
import { createFileRoute } from "@tanstack/react-router";
import { eq } from "drizzle-orm";

export const Route = createFileRoute("/api/resend")({
  server: {
    handlers: {
      // biome-ignore lint/complexity/noExcessiveCognitiveComplexity: valid code
      POST: async ({ request }) => {
        try {
          // Verify webhook signature if Resend provides one
          // const signature = request.headers.get("svix-signature");
          // const webhookSecret = process.env.RESEND_WEBHOOK_SECRET;

          // Optional: Verify webhook authenticity
          // if (webhookSecret && signature) {
          //   // Implement signature verification here
          // }

          const payload = await request.json();
          const { type, data } = payload;

          if (!(type && data)) {
            return Response.json(
              { error: "Invalid webhook payload" },
              { status: 400 }
            );
          }

          // Extract email ID and event type
          const emailId = data.email_id || data.id;

          if (!emailId) {
            return Response.json(
              { error: "Missing email ID in webhook" },
              { status: 400 }
            );
          }

          // Find the tracking record by external email ID
          const trackingRecord = await db.query.emailTracking.findFirst({
            where: eq(emailTracking.externalEmailId, emailId),
            with: {
              emailCampaign: true,
            },
          });

          if (!trackingRecord) {
            // Email not tracked - might be a transactional email, not a campaign
            return Response.json(
              { message: "Email not tracked, skipping" },
              { status: 200 }
            );
          }

          const now = new Date();

          // Handle different event types
          switch (type) {
            case "email.delivered":
              // Update tracking record
              await db
                .update(emailTracking)
                .set({
                  deliveredAt: now,
                })
                .where(eq(emailTracking.id, trackingRecord.id));

              // Update campaign stats
              await db
                .update(emailCampaigns)
                .set({
                  totalDelivered:
                    trackingRecord.emailCampaign.totalDelivered + 1,
                })
                .where(eq(emailCampaigns.id, trackingRecord.emailCampaignId));
              break;

            case "email.opened": {
              // Update tracking record
              const currentOpenCount = trackingRecord.openCount;
              const isFirstOpen = !trackingRecord.openedAt;

              await db
                .update(emailTracking)
                .set({
                  openedAt: trackingRecord.openedAt || now,
                  openCount: currentOpenCount + 1,
                })
                .where(eq(emailTracking.id, trackingRecord.id));

              // Only increment totalOpened on first open
              if (isFirstOpen) {
                await db
                  .update(emailCampaigns)
                  .set({
                    totalOpened: trackingRecord.emailCampaign.totalOpened + 1,
                  })
                  .where(eq(emailCampaigns.id, trackingRecord.emailCampaignId));
              }
              break;
            }

            case "email.clicked": {
              // Update tracking record
              const currentClickCount = trackingRecord.clickCount;
              const isFirstClick = !trackingRecord.clickedAt;

              await db
                .update(emailTracking)
                .set({
                  clickedAt: trackingRecord.clickedAt || now,
                  clickCount: currentClickCount + 1,
                })
                .where(eq(emailTracking.id, trackingRecord.id));

              // Only increment totalClicked on first click
              if (isFirstClick) {
                await db
                  .update(emailCampaigns)
                  .set({
                    totalClicked: trackingRecord.emailCampaign.totalClicked + 1,
                  })
                  .where(eq(emailCampaigns.id, trackingRecord.emailCampaignId));
              }
              break;
            }

            case "email.bounced":
              // Update tracking record
              await db
                .update(emailTracking)
                .set({
                  bouncedAt: now,
                })
                .where(eq(emailTracking.id, trackingRecord.id));

              // Update campaign stats
              await db
                .update(emailCampaigns)
                .set({
                  totalBounced: trackingRecord.emailCampaign.totalBounced + 1,
                })
                .where(eq(emailCampaigns.id, trackingRecord.emailCampaignId));

              // Mark subscriber as inactive if hard bounce
              if (data.bounce_type === "hard") {
                await db
                  .update(emailSubscribers)
                  .set({
                    isActive: false,
                    unsubscribedAt: now,
                  })
                  .where(eq(emailSubscribers.id, trackingRecord.subscriberId));
              }
              break;

            case "email.complained":
            case "email.spam_report":
              // Automatically unsubscribe on spam complaints
              await db
                .update(emailSubscribers)
                .set({
                  isActive: false,
                  unsubscribedAt: now,
                })
                .where(eq(emailSubscribers.id, trackingRecord.subscriberId));

              // Update campaign stats
              await db
                .update(emailCampaigns)
                .set({
                  totalUnsubscribed:
                    trackingRecord.emailCampaign.totalUnsubscribed + 1,
                })
                .where(eq(emailCampaigns.id, trackingRecord.emailCampaignId));
              break;

            default:
              // Unknown event type - log and continue
              console.log(`Unknown webhook event type: ${type}`);
          }

          return Response.json(
            { message: "Webhook processed successfully" },
            { status: 200 }
          );
        } catch (error) {
          console.error("Error processing Resend webhook:", error);
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
