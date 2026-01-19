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
  MoreVertical,
  Plus,
  Send,
  Share2,
} from "lucide-react";
import { useTRPC } from "~/lib/trpc";

export const Route = createFileRoute("/(dashboard)/marketing/social/")({
  component: SocialMarketingDashboard,
  head: () => ({
    meta: [{ title: "Social Marketing | Dashboard" }],
  }),
  loader: async ({ context: { trpc, queryClient } }) => {
    await queryClient.prefetchQuery(trpc.socialMarketing.getAll.queryOptions());
  },
});

function SocialMarketingDashboard() {
  const trpc = useTRPC();

  const { data: posts } = useSuspenseQuery(
    trpc.socialMarketing.getAll.queryOptions()
  );

  const publishedPosts = posts.filter((p) => p.status === "published").length;
  const scheduledPosts = posts.filter((p) => p.status === "scheduled").length;
  const draftPosts = posts.filter((p) => p.status === "draft").length;

  const getStatusColor = (
    status: string
  ): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case "draft":
        return "secondary";
      case "scheduled":
        return "outline";
      case "publishing":
        return "default";
      case "published":
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
      case "published":
        return "border-green-500/20 bg-green-500/5";
      case "failed":
        return "border-red-500/20 bg-red-500/5";
      default:
        return "";
    }
  };

  const getPlatformIcon = (_platform: string) => <Share2 className="h-5 w-5" />;

  return (
    <>
      {/* Header */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-bold text-2xl tracking-tight">
            Social Marketing
          </h2>
          <p className="text-muted-foreground">
            Manage your social media posts across platforms
          </p>
        </div>
        <Link
          aria-label="Create new social post"
          className={cn(buttonVariants({ variant: "default" }), "group")}
          to="/marketing/social/posts/create"
        >
          <span>New Post</span> <Plus className="ml-1" size={18} />
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="mb-6 grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">Total Posts</CardTitle>
            <Share2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">{posts.length}</div>
            <p className="text-muted-foreground text-xs">
              {publishedPosts} published
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">Scheduled</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">{scheduledPosts}</div>
            <p className="text-muted-foreground text-xs">Awaiting publish</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">Drafts</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">{draftPosts}</div>
            <p className="text-muted-foreground text-xs">Ready to schedule</p>
          </CardContent>
        </Card>
      </div>

      {/* Posts Section */}
      <div className="space-y-4">
        <h3 className="font-semibold text-lg">Recent Posts</h3>

        {posts.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <div className="mb-6 rounded-full bg-muted p-4">
                <Share2 className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="mb-2 font-semibold text-lg">No posts yet</h3>
              <p className="mb-6 max-w-sm text-center text-muted-foreground text-sm">
                Create your first social media post to start reaching your
                audience
              </p>
              <Link to="/marketing/social/posts/create">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Post
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {posts.map((post) => (
              <Card
                className={cn(
                  "group transition-colors hover:border-primary/20",
                  getStatusStyles(post.status)
                )}
                key={post.id}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-3">
                        {/* Platform icon with status indicator */}
                        <div className="relative">
                          <div
                            className={cn(
                              "rounded-lg p-2",
                              post.status === "scheduled" &&
                                "bg-blue-500/10 text-blue-500",
                              post.status === "published" &&
                                "bg-green-500/10 text-green-500",
                              post.status === "failed" &&
                                "bg-red-500/10 text-red-500",
                              post.status === "draft" &&
                                "bg-muted text-muted-foreground",
                              post.status === "publishing" &&
                                "bg-primary/10 text-primary"
                            )}
                          >
                            {getPlatformIcon(post.platform)}
                          </div>
                          {post.status === "scheduled" && (
                            <span className="-top-1 -right-1 absolute flex h-3 w-3">
                              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-500 opacity-75" />
                              <span className="relative inline-flex h-3 w-3 rounded-full bg-blue-500" />
                            </span>
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <Badge className="capitalize" variant="outline">
                              {post.platform.toLowerCase()}
                            </Badge>
                            <Badge
                              className="capitalize"
                              variant={getStatusColor(post.status)}
                            >
                              {post.status}
                            </Badge>
                          </div>
                          <CardDescription className="mt-1 line-clamp-2">
                            {post.content}
                          </CardDescription>
                        </div>
                      </div>
                    </div>

                    {/* Actions dropdown */}
                    <div className="flex items-center gap-2">
                      {/* Quick actions on hover */}
                      <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                        <Link
                          params={{ postId: post.id }}
                          to="/marketing/social/posts/$postId"
                        >
                          <Button size="sm" variant="ghost">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                        {post.status !== "published" && (
                          <Link
                            params={{ postId: post.id }}
                            to="/marketing/social/posts/$postId/edit"
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
                              params={{ postId: post.id }}
                              to="/marketing/social/posts/$postId"
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </Link>
                          </DropdownMenuItem>
                          {post.status !== "published" && (
                            <>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem asChild>
                                <Link
                                  params={{ postId: post.id }}
                                  to="/marketing/social/posts/$postId/edit"
                                >
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit Post
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
                        {format(new Date(post.createdAt), "MMM d, yyyy")}
                      </span>
                    </div>
                    {post.scheduledAt && post.status === "scheduled" && (
                      <div className="flex items-center gap-2 font-medium text-blue-500">
                        <Clock className="h-4 w-4" />
                        <span>
                          Scheduled{" "}
                          {formatDistanceToNow(new Date(post.scheduledAt), {
                            addSuffix: true,
                          })}
                        </span>
                        <span className="font-normal text-muted-foreground">
                          (
                          {format(
                            new Date(post.scheduledAt),
                            "MMM d 'at' h:mm a"
                          )}
                          )
                        </span>
                      </div>
                    )}
                    {post.publishedAt && (
                      <div className="flex items-center gap-2 text-green-500">
                        <Send className="h-4 w-4" />
                        <span>
                          Published{" "}
                          {format(
                            new Date(post.publishedAt),
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
