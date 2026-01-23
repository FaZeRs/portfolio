import { cn } from "@acme/ui";
import { Badge } from "@acme/ui/badge";
import { Button, buttonVariants } from "@acme/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@acme/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@acme/ui/dropdown-menu";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { format, formatDistanceToNow } from "date-fns";
import {
  Calendar,
  Clock,
  Edit,
  Eye,
  Mail,
  MoreVertical,
  Plus,
  Send,
  Users,
} from "lucide-react";
import { useTRPC } from "~/lib/trpc";

export const Route = createFileRoute("/(dashboard)/marketing/email/")({
  component: EmailMarketingDashboard,
  head: () => ({
    meta: [{ title: "Email Marketing | Dashboard" }],
  }),
  loader: async ({ context: { trpc, queryClient } }) => {
    await Promise.all([
      queryClient.prefetchQuery(trpc.emailMarketing.getAll.queryOptions()),
      queryClient.prefetchQuery(
        trpc.emailMarketing.getAllSubscribers.queryOptions()
      ),
    ]);
  },
});

function EmailMarketingDashboard() {
  const trpc = useTRPC();

  const { data: campaigns } = useSuspenseQuery(
    trpc.emailMarketing.getAll.queryOptions()
  );

  const { data: subscribers } = useSuspenseQuery(
    trpc.emailMarketing.getAllSubscribers.queryOptions()
  );

  const activeSubscribers = subscribers.filter((s) => s.isActive).length;
  const sentCampaigns = campaigns.filter((c) => c.status === "sent").length;
  const scheduledCampaigns = campaigns.filter(
    (c) => c.status === "scheduled"
  ).length;

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

  const getStatusStyles = (status: string) => {
    switch (status) {
      case "scheduled":
        return "border-blue-500/20 bg-blue-500/5";
      case "sent":
        return "border-green-500/20 bg-green-500/5";
      case "failed":
        return "border-red-500/20 bg-red-500/5";
      default:
        return "";
    }
  };

  return (
    <>
      {/* Header */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-bold text-2xl tracking-tight">Email Marketing</h2>
          <p className="text-muted-foreground">
            Manage your email campaigns and subscribers
          </p>
        </div>
        <Link
          aria-label="Create new email campaign"
          className={cn(buttonVariants({ variant: "default" }), "group")}
          to="/marketing/email/campaigns/create"
        >
          <span>New Campaign</span> <Plus className="ml-1" size={18} />
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="mb-6 grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">
              Total Campaigns
            </CardTitle>
            <Send className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">{campaigns.length}</div>
            <p className="text-muted-foreground text-xs">
              {sentCampaigns} sent
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">
              Active Subscribers
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">{activeSubscribers}</div>
            <p className="text-muted-foreground text-xs">
              {subscribers.length} total
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">
              Scheduled Campaigns
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">{scheduledCampaigns}</div>
            <p className="text-muted-foreground text-xs">Awaiting execution</p>
          </CardContent>
        </Card>
      </div>

      {/* Campaigns Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-lg">Recent Campaigns</h3>
          <Link to="/marketing/email/subscribers">
            <Button variant="outline">
              <Users className="mr-2 h-4 w-4" />
              Manage Subscribers
            </Button>
          </Link>
        </div>

        {campaigns.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <div className="mb-6 rounded-full bg-muted p-4">
                <Mail className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="mb-2 font-semibold text-lg">No campaigns yet</h3>
              <p className="mb-6 max-w-sm text-center text-muted-foreground text-sm">
                Create your first email campaign to start engaging with your
                subscribers
              </p>
              <Link to="/marketing/email/campaigns/create">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Campaign
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {campaigns.map((campaign) => (
              <Card
                className={cn(
                  "group transition-colors hover:border-primary/20",
                  getStatusStyles(campaign.status)
                )}
                key={campaign.id}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-3">
                        {/* Campaign icon with status indicator */}
                        <div className="relative">
                          <div
                            className={cn(
                              "rounded-lg p-2",
                              campaign.status === "scheduled" &&
                                "bg-blue-500/10 text-blue-500",
                              campaign.status === "sent" &&
                                "bg-green-500/10 text-green-500",
                              campaign.status === "failed" &&
                                "bg-red-500/10 text-red-500",
                              campaign.status === "draft" &&
                                "bg-muted text-muted-foreground",
                              campaign.status === "sending" &&
                                "bg-primary/10 text-primary"
                            )}
                          >
                            <Mail className="h-5 w-5" />
                          </div>
                          {campaign.status === "scheduled" && (
                            <span className="-top-1 -right-1 absolute flex h-3 w-3">
                              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-500 opacity-75" />
                              <span className="relative inline-flex h-3 w-3 rounded-full bg-blue-500" />
                            </span>
                          )}
                        </div>
                        <div>
                          <CardTitle className="text-lg">
                            {campaign.subject}
                          </CardTitle>
                          {campaign.previewText && (
                            <CardDescription className="mt-0.5">
                              {campaign.previewText}
                            </CardDescription>
                          )}
                        </div>
                        <Badge
                          className="capitalize"
                          variant={getStatusColor(campaign.status)}
                        >
                          {campaign.status}
                        </Badge>
                      </div>
                    </div>

                    {/* Actions dropdown */}
                    <div className="flex items-center gap-2">
                      {/* Quick actions on hover */}
                      <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                        <Link
                          params={{ campaignId: campaign.id }}
                          to="/marketing/email/campaigns/$campaignId"
                        >
                          <Button size="sm" variant="ghost">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                        {campaign.status !== "sent" && (
                          <Link
                            params={{ campaignId: campaign.id }}
                            to="/marketing/email/campaigns/$campaignId/edit"
                          >
                            <Button size="sm" variant="ghost">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </Link>
                        )}
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button size="sm" variant="ghost">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link
                              params={{ campaignId: campaign.id }}
                              to="/marketing/email/campaigns/$campaignId"
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </Link>
                          </DropdownMenuItem>
                          {campaign.status !== "sent" && (
                            <>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem asChild>
                                <Link
                                  params={{ campaignId: campaign.id }}
                                  to="/marketing/email/campaigns/$campaignId/edit"
                                >
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit Campaign
                                </Link>
                              </DropdownMenuItem>
                            </>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex flex-wrap items-center gap-4 text-muted-foreground text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>
                        Created{" "}
                        {format(new Date(campaign.createdAt), "MMM d, yyyy")}
                      </span>
                    </div>
                    {campaign.scheduledAt &&
                      campaign.status === "scheduled" && (
                        <div className="flex items-center gap-2 font-medium text-blue-500">
                          <Clock className="h-4 w-4" />
                          <span>
                            Scheduled{" "}
                            {formatDistanceToNow(
                              new Date(campaign.scheduledAt),
                              {
                                addSuffix: true,
                              }
                            )}
                          </span>
                          <span className="font-normal text-muted-foreground">
                            (
                            {format(
                              new Date(campaign.scheduledAt),
                              "MMM d 'at' h:mm a"
                            )}
                            )
                          </span>
                        </div>
                      )}
                    {campaign.sentAt && (
                      <div className="flex items-center gap-2 text-green-500">
                        <Send className="h-4 w-4" />
                        <span>
                          Sent{" "}
                          {format(
                            new Date(campaign.sentAt),
                            "MMM d, yyyy 'at' h:mm a"
                          )}
                        </span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
