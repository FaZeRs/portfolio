import { useSuspenseQuery } from "@tanstack/react-query";
import { Loader2Icon } from "lucide-react";
import { useTRPC } from "~/trpc/react";
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
  const { data: comments, isLoading } = useSuspenseQuery(
    trpc.comment.all.queryOptions({ articleId: articleId }),
  );

  return (
    <div className="space-y-2 rounded-lg border py-2 dark:bg-zinc-900/30">
      {isLoading ? (
        <div className="flex min-h-20 items-center justify-center">
          <Loader2Icon className="size-7 animate-spin" />
        </div>
      ) : (
        comments
          ?.filter((c) => !c.parentId)
          .map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              articleSlug={articleSlug}
            />
          ))
      )}

      {comments?.length === 0 ? (
        <div className="flex min-h-20 items-center justify-center">
          <p className="text-muted-foreground text-sm">No comments</p>
        </div>
      ) : null}
    </div>
  );
}
