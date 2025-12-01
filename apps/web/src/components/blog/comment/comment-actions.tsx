import { Button } from "@acme/ui/button";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { ThumbsDownIcon, ThumbsUpIcon } from "lucide-react";
import { toast } from "sonner";
import { useCommentContext } from "~/contexts/comment";
import { authQueryOptions } from "~/lib/auth/queries";
import { useTRPC } from "~/lib/trpc";

export default function CommentActions() {
  const { data: currentUser } = useSuspenseQuery(authQueryOptions());
  const isAuthenticated = Boolean(currentUser);
  const { comment, setIsReplying } = useCommentContext();
  const trpc = useTRPC();
  const { mutate: reactMutation } = useMutation({
    ...trpc.comment.react.mutationOptions(),
    onError: (_error) => {
      toast.error("Failed to react to comment");
    },
  });

  const handleCommentReaction = (like: boolean) => {
    reactMutation({ id: comment.comment.id, like });
  };

  return (
    <div className="flex gap-1">
      <Button
        className="gap-1"
        disabled={!isAuthenticated}
        onClick={() => handleCommentReaction(true)}
        size="sm"
        variant="secondary"
      >
        <ThumbsUpIcon className="size-4" />
        {comment.likesCount}
      </Button>

      <Button
        className="gap-1"
        disabled={!isAuthenticated}
        onClick={() => handleCommentReaction(false)}
        size="sm"
        variant="secondary"
      >
        <ThumbsDownIcon className="size-4" />
        {comment.dislikesCount}
      </Button>

      {!comment.comment.parentId && (
        <Button
          className="font-medium text-muted-foreground text-xs"
          disabled={!isAuthenticated}
          onClick={() => setIsReplying(true)}
          size="sm"
          variant="secondary"
        >
          Reply
        </Button>
      )}
    </div>
  );
}
