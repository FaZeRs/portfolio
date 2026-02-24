import { useSuspenseQuery } from "@tanstack/react-query";
import { useTRPC } from "~/lib/trpc";
import CommentItem from "./comment-item";

interface CommentListProps {
  articleId: string;
  articleSlug: string;
}

export default function CommentList({
  articleId,
  articleSlug,
}: Readonly<CommentListProps>) {
  const trpc = useTRPC();
  const { data: comments } = useSuspenseQuery(
    trpc.comment.all.queryOptions({ articleId })
  );
  const filteredComments = comments?.filter((c) => !c.comment.parentId);

  return (
    <div className="space-y-2 rounded-lg border py-2 dark:bg-zinc-900/30">
      {filteredComments.map((comment) => (
        <CommentItem
          articleSlug={articleSlug}
          comment={comment}
          key={comment.comment.id}
        />
      ))}

      {filteredComments.length === 0 ? (
        <div className="flex min-h-20 items-center justify-center">
          <p className="text-muted-foreground text-sm">No comments</p>
        </div>
      ) : null}
    </div>
  );
}
