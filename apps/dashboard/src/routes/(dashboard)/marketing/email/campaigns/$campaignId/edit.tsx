import { cn } from "@acme/ui";
import { buttonVariants } from "@acme/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@acme/ui/card";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Mail } from "lucide-react";
import { useTRPC } from "~/lib/trpc";

export const Route = createFileRoute(
  "/(dashboard)/marketing/email/campaigns/$campaignId/edit"
)({
  component: EditCampaignPage,
  head: () => ({
    meta: [{ title: "Edit Campaign | Email Marketing" }],
  }),
  loader: async ({ context: { trpc, queryClient }, params }) => {
    await queryClient.prefetchQuery(
      trpc.emailMarketing.getById.queryOptions({ id: params.campaignId })
    );
  },
});

function EditCampaignPage() {
  const { campaignId } = Route.useParams();
  const trpc = useTRPC();

  const { data: campaign } = useSuspenseQuery(
    trpc.emailMarketing.getById.queryOptions({ id: campaignId })
  );

  if (!campaign) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <h2 className="font-bold text-2xl">Campaign not found</h2>
        <Link
          className={buttonVariants({ variant: "outline" })}
          to="/marketing/email"
        >
          Back to Email Marketing
        </Link>
      </div>
    );
  }

  return (
    <>
      {/* Header */}
      <div className="mb-4">
        <Link
          className={cn(
            buttonVariants({ variant: "ghost", size: "sm" }),
            "mb-4"
          )}
          params={{ campaignId }}
          to="/marketing/email/campaigns/$campaignId"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Campaign
        </Link>
        <h2 className="font-bold text-2xl tracking-tight">Edit Campaign</h2>
        <p className="text-muted-foreground">
          Edit campaign: {campaign.subject}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Campaign Editor
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Campaign editing form will be implemented here. For now, please use
            the create page as a reference.
          </p>
        </CardContent>
      </Card>
    </>
  );
}
