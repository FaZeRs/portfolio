import { cn } from "@acme/ui";
import { Badge } from "@acme/ui/badge";
import { Button, buttonVariants } from "@acme/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@acme/ui/card";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { format } from "date-fns";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Edit,
  ExternalLink,
  Heart,
  MessageCircle,
  RefreshCw,
  Share2,
} from "lucide-react";
import { useTRPC } from "~/lib/trpc";

export const Route = createFileRoute(
  "/(dashboard)/marketing/social/posts/$postId"
)({
  component: PostDetailPage,
  head: () => ({
    meta: [{ title: "Post Details | Social Marketing" }],
  }),
  loader: async ({ context: { trpc, queryClient }, params }) => {
    await queryClient.prefetchQuery(
      trpc.socialMarketing.getById.queryOptions({ id: params.postId })
    );
  },
});

function PostDetailPage() {
  const { postId } = Route.useParams();
  const trpc = useTRPC();

  const { data: post } = useSuspenseQuery(
    trpc.socialMarketing.getById.queryOptions({ id: postId })
  );

  if (!post) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <h2 className="font-bold text-2xl">Post not found</h2>
        <p className="text-muted-foreground">
          The post you're looking for doesn't exist.
        </p>
        <Link
          className={buttonVariants({ variant: "outline" })}
          to="/marketing/social"
        >
          Back to Social Marketing
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

  return (
    <>
      {/* Header */}
      <div className="mb-4">
        <Link
          className={cn(
            buttonVariants({ variant: "ghost", size: "sm" }),
            "mb-4"
          )}
          to="/marketing/social"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Social Marketing
        </Link>

        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="rounded-lg bg-primary/10 p-3">
              <Share2 className="h-6 w-6 text-primary" />
            </div>
            <div>
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
              <p className="mt-1 text-muted-foreground text-sm">
                Created {format(new Date(post.createdAt), "MMM d, yyyy")}
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            {post.postUrl && (
              <a href={post.postUrl} rel="noopener noreferrer" target="_blank">
                <Button variant="outline">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  View Post
                </Button>
              </a>
            )}
            {post.status !== "published" && (
              <Link
                params={{ postId }}
                to="/marketing/social/posts/$postId/edit"
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
        {/* Post Content */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Post Content</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap">{post.content}</p>
            {post.mediaUrls && post.mediaUrls.length > 0 && (
              <div className="mt-4 grid grid-cols-4 gap-2">
                {post.mediaUrls.map((url) => (
                  <img
                    alt="Post media"
                    className="h-24 w-full rounded border object-cover"
                    height={96}
                    key={url}
                    src={url}
                    width={96}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Stats */}
        {post.status === "published" && (
          <Card>
            <CardHeader>
              <CardTitle>Engagement</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-muted p-2">
                    <Heart className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-medium text-2xl">{post.likes ?? 0}</p>
                    <p className="text-muted-foreground text-sm">Likes</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-muted p-2">
                    <Share2 className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-medium text-2xl">{post.shares ?? 0}</p>
                    <p className="text-muted-foreground text-sm">Shares</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-muted p-2">
                    <MessageCircle className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-medium text-2xl">{post.comments ?? 0}</p>
                    <p className="text-muted-foreground text-sm">Comments</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-muted p-2">
                    <RefreshCw className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-medium text-2xl">
                      {post.impressions ?? 0}
                    </p>
                    <p className="text-muted-foreground text-sm">Impressions</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Timeline */}
        <Card>
          <CardHeader>
            <CardTitle>Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  Created: {format(new Date(post.createdAt), "PPp")}
                </span>
              </div>
              {post.scheduledAt && (
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-blue-500" />
                  <span className="text-sm">
                    Scheduled: {format(new Date(post.scheduledAt), "PPp")}
                  </span>
                </div>
              )}
              {post.publishedAt && (
                <div className="flex items-center gap-2">
                  <Share2 className="h-4 w-4 text-green-500" />
                  <span className="text-sm">
                    Published: {format(new Date(post.publishedAt), "PPp")}
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
