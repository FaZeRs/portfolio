import { useMutation } from "@tanstack/react-query";
import { ThumbsDownIcon, ThumbsUpIcon } from "lucide-react";
import { Button } from "~/components/ui/button";
import { useCommentContext } from "~/contexts/comment";
import { useCurrentUser } from "~/hooks/use-current-user";
import { useTRPC } from "~/trpc/react";

export default function CommentActions() {
  const { isAuthenticated, isPending } = useCurrentUser();
  const { comment, setIsReplying } = useCommentContext();
  const trpc = useTRPC();
  const { mutate: reactMutation } = useMutation({
    ...trpc.comment.react.mutationOptions(),
  });

  const handleCommentReaction = (like: boolean) => {
    reactMutation({ id: comment.id, like });
  };

  return (
    <div className="flex gap-1">
      <Button
        variant="secondary"
        size="sm"
        disabled={!isAuthenticated}
        className="gap-1"
        onClick={() => handleCommentReaction(true)}
      >
        <ThumbsUpIcon className="size-4" />
        {comment.likesCount}
      </Button>

      <Button
        variant="secondary"
        size="sm"
        disabled={!isAuthenticated}
        onClick={() => handleCommentReaction(false)}
        className="gap-1"
      >
        <ThumbsDownIcon className="size-4" />
        {comment.dislikesCount}
      </Button>

      {!comment.parentId && !isPending && isAuthenticated && (
        <Button
          size="sm"
          variant="secondary"
          className="font-medium text-muted-foreground text-xs"
          onClick={() => setIsReplying(true)}
        >
          Reply
        </Button>
      )}
    </div>
  );
}
