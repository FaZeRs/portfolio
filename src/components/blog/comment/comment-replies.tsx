import { useSuspenseQuery } from "@tanstack/react-query";
import { Loader2Icon } from "lucide-react";
import { Button } from "~/components/ui/button";
import { useCommentContext } from "~/contexts/comment";
import { useTRPC } from "~/trpc/react";
import CommentItem from "./comment-item";

interface CommentRepliesProps {
  articleSlug: string;
}

export default function CommentReplies({
  articleSlug,
}: Readonly<CommentRepliesProps>) {
  const { comment, isOpenReplies, setIsOpenReplies } = useCommentContext();
  const trpc = useTRPC();

  const { data: comments, isLoading } = useSuspenseQuery(
    trpc.comment.all.queryOptions({
      articleId: comment.comment.articleId,
      parentId: comment.comment.id,
    }),
  );

  return (
    <div>
      {isOpenReplies && !isLoading ? (
        comments?.map((reply) => (
          <CommentItem
            key={reply.comment.id}
            comment={reply}
            articleSlug={articleSlug}
          />
        ))
      ) : (
        <Button
          variant="link"
          className="px-0"
          onClick={() => setIsOpenReplies(true)}
          type="button"
        >
          Show all {comment.repliesCount} replies
          {isLoading ? (
            <Loader2Icon className="ml-2 size-3 animate-spin" />
          ) : null}
        </Button>
      )}
    </div>
  );
}
