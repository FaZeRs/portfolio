import { Button } from "@acme/ui/button";
import { useQuery } from "@tanstack/react-query";
import { Loader2Icon } from "lucide-react";
import { useCommentContext } from "~/contexts/comment";
import { queryKeys } from "~/lib/query-keys";
import { $getAllComments } from "~/lib/server";
import CommentItem from "./comment-item";

interface CommentRepliesProps {
  articleSlug: string;
}

export default function CommentReplies({
  articleSlug,
}: Readonly<CommentRepliesProps>) {
  const { comment, isOpenReplies, setIsOpenReplies } = useCommentContext();

  const { data: comments, isLoading } = useQuery({
    queryKey: queryKeys.comment.byArticleAndParent(
      comment.comment.articleId,
      comment.comment.id
    ),
    queryFn: () =>
      $getAllComments({
        data: {
          articleId: comment.comment.articleId,
          parentId: comment.comment.id,
        },
      }),
  });

  return (
    <div>
      {isOpenReplies && !isLoading ? (
        // biome-ignore lint/suspicious/noExplicitAny: Drizzle relation types from $getAllComments
        comments?.map((reply: any) => (
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
