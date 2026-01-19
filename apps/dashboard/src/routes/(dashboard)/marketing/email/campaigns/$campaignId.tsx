import { cn } from "@acme/ui";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@acme/ui/alert-dialog";
import { Badge } from "@acme/ui/badge";
import { Button, buttonVariants } from "@acme/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@acme/ui/card";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { format } from "date-fns";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Edit,
  Loader2,
  Mail,
  Send,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import { useTRPC } from "~/lib/trpc";

export const Route = createFileRoute(
  "/(dashboard)/marketing/email/campaigns/$campaignId"
)({
  component: CampaignDetailPage,
  head: () => ({
    meta: [{ title: "Campaign Details | Email Marketing" }],
  }),
  loader: async ({ context: { trpc, queryClient }, params }) => {
    await queryClient.prefetchQuery(
      trpc.emailMarketing.getById.queryOptions({ id: params.campaignId })
    );
  },
});

function CampaignDetailPage() {
  const { campaignId } = Route.useParams();
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const { data: campaign } = useSuspenseQuery(
    trpc.emailMarketing.getById.queryOptions({ id: campaignId })
  );

  const sendMutation = useMutation(
    trpc.emailMarketing.send.mutationOptions({
      onSuccess: (data) => {
        toast.success(
          `Campaign sent successfully! ${data.totalSent} emails delivered.`
        );
        queryClient.invalidateQueries({
          queryKey: trpc.emailMarketing.getById.queryKey({ id: campaignId }),
        });
      },
      onError: (error) => {
        toast.error(error.message || "Failed to send campaign");
      },
    })
  );

  if (!campaign) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <h2 className="font-bold text-2xl">Campaign not found</h2>
        <p className="text-muted-foreground">
          The campaign you're looking for doesn't exist.
        </p>
        <Link
          className={buttonVariants({ variant: "outline" })}
          to="/marketing/email"
        >
          Back to Email Marketing
        </Link>
      </div>
    );
  }

  const getStatusColor = (
    status: string
  ): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case "draft":
        return "secondary";
      case "scheduled":
        return "outline";
      case "sending":
        return "default";
      case "sent":
        return "default";
      case "failed":
        return "destructive";
      default:
        return "default";
    }
  };

  return (
    <>
      {/* Header */}
      <div className="mb-4">
        <Link
          className={cn(
            buttonVariants({ variant: "ghost", size: "sm" }),
            "mb-4"
          )}
          to="/marketing/email"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Email Marketing
        </Link>

        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="rounded-lg bg-primary/10 p-3">
              <Mail className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h2 className="font-bold text-2xl tracking-tight">
                {campaign.subject}
              </h2>
              <div className="mt-1 flex items-center gap-2">
                <Badge
                  className="capitalize"
                  variant={getStatusColor(campaign.status)}
                >
                  {campaign.status}
                </Badge>
                <span className="text-muted-foreground text-sm">
                  Created {format(new Date(campaign.createdAt), "MMM d, yyyy")}
                </span>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            {campaign.status === "draft" && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button disabled={sendMutation.isPending}>
                    {sendMutation.isPending ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="mr-2 h-4 w-4" />
                    )}
                    Send Now
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Send Campaign Now?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will immediately send the campaign "
                      {campaign.subject}" to all active subscribers. This action
                      cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => sendMutation.mutate({ id: campaignId })}
                    >
                      Send Campaign
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
            {campaign.status !== "sent" && (
              <Link
                params={{ campaignId }}
                to="/marketing/email/campaigns/$campaignId/edit"
              >
                <Button variant="outline">
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Campaign Info */}
        <Card>
          <CardHeader>
            <CardTitle>Campaign Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-muted-foreground text-sm">Subject Line</p>
              <p className="font-medium">{campaign.subject}</p>
            </div>
            {campaign.previewText && (
              <div>
                <p className="text-muted-foreground text-sm">Preview Text</p>
                <p className="font-medium">{campaign.previewText}</p>
              </div>
            )}
            <div>
              <p className="text-muted-foreground text-sm">Email Type</p>
              <p className="font-medium capitalize">
                {campaign.emailType.replace("_", " ")}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <Card>
          <CardHeader>
            <CardTitle>Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-muted p-2">
                  <Users className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-medium text-2xl">
                    {campaign.totalRecipients ?? 0}
                  </p>
                  <p className="text-muted-foreground text-sm">Recipients</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-muted p-2">
                  <Send className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-medium text-2xl">
                    {campaign.totalSent ?? 0}
                  </p>
                  <p className="text-muted-foreground text-sm">Sent</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-muted p-2">
                  <Mail className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-medium text-2xl">
                    {campaign.totalOpened ?? 0}
                  </p>
                  <p className="text-muted-foreground text-sm">Opened</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-muted p-2">
                  <Clock className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-medium text-2xl">
                    {campaign.totalClicked ?? 0}
                  </p>
                  <p className="text-muted-foreground text-sm">Clicked</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Timeline */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-6">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  Created: {format(new Date(campaign.createdAt), "PPp")}
                </span>
              </div>
              {campaign.scheduledAt && (
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-blue-500" />
                  <span className="text-sm">
                    Scheduled: {format(new Date(campaign.scheduledAt), "PPp")}
                  </span>
                </div>
              )}
              {campaign.sentAt && (
                <div className="flex items-center gap-2">
                  <Send className="h-4 w-4 text-green-500" />
                  <span className="text-sm">
                    Sent: {format(new Date(campaign.sentAt), "PPp")}
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
