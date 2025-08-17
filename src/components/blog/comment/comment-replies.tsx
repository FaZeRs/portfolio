import { useQuery } from "@tanstack/react-query";
import { Loader2Icon } from "lucide-react";
import { Button } from "~/components/ui/button";
import { useCommentContext } from "~/contexts/comment";
import { useTRPC } from "~/trpc/react";
import CommentItem from "./comment-item";

type CommentRepliesProps = {
  articleSlug: string;
};

export default function CommentReplies({
  articleSlug,
}: Readonly<CommentRepliesProps>) {
  const { comment, isOpenReplies, setIsOpenReplies } = useCommentContext();
  const trpc = useTRPC();

  const { data: comments, isLoading } = useQuery(
    trpc.comment.all.queryOptions({
      articleId: comment.comment.articleId,
      parentId: comment.comment.id,
    })
  );

  return (
    <div>
      {isOpenReplies && !isLoading ? (
        comments?.map((reply) => (
          <CommentItem
            articleSlug={articleSlug}
            comment={reply}
            key={reply.comment.id}
          />
        ))
      ) : (
        <Button
          className="px-0"
          onClick={() => setIsOpenReplies(true)}
          type="button"
          variant="link"
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
