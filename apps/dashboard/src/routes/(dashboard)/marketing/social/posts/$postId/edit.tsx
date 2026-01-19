import { cn } from "@acme/ui";
import { buttonVariants } from "@acme/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@acme/ui/card";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Share2 } from "lucide-react";
import { useTRPC } from "~/lib/trpc";

export const Route = createFileRoute(
  "/(dashboard)/marketing/social/posts/$postId/edit"
)({
  component: EditPostPage,
  head: () => ({
    meta: [{ title: "Edit Post | Social Marketing" }],
  }),
  loader: async ({ context: { trpc, queryClient }, params }) => {
    await queryClient.prefetchQuery(
      trpc.socialMarketing.getById.queryOptions({ id: params.postId })
    );
  },
});

function EditPostPage() {
  const { postId } = Route.useParams();
  const trpc = useTRPC();

  const { data: post } = useSuspenseQuery(
    trpc.socialMarketing.getById.queryOptions({ id: postId })
  );

  if (!post) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <h2 className="font-bold text-2xl">Post not found</h2>
        <Link
          className={buttonVariants({ variant: "outline" })}
          to="/marketing/social"
        >
          Back to Social Marketing
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
          params={{ postId }}
          to="/marketing/social/posts/$postId"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Post
        </Link>
        <h2 className="font-bold text-2xl tracking-tight">Edit Post</h2>
        <p className="text-muted-foreground">
          Edit your {post.platform.toLowerCase()} post
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5" />
            Post Editor
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Post editing form will be implemented here. For now, please use the
            create page as a reference.
          </p>
        </CardContent>
      </Card>
    </>
  );
}
