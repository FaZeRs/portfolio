import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { FormEvent } from "react";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import { useCommentContext } from "~/contexts/comment";
import { authQueryOptions } from "~/lib/auth/queries";
import { useTRPC } from "~/trpc/react";
import CommentEditor, { useCommentEditor } from "./comment-editor";

export default function CommentReply() {
  const [editor, setEditor] = useCommentEditor();
  const { comment, setIsReplying } = useCommentContext();
  const { data: currentUser } = useSuspenseQuery(authQueryOptions());
  const isAuthenticated = Boolean(currentUser);

  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    ...trpc.comment.create.mutationOptions(),
    onSuccess: () => {
      if (editor) {
        editor.clearValue();
      }
      setIsReplying(false);
      toast.success("Comment posted");
    },
    onError: (error) => {
      toast.error(error.message);
      console.error(error);
    },
    onSettled: async () => {
      await queryClient.invalidateQueries(
        trpc.comment.all.queryOptions({
          articleId: comment.comment.articleId,
          parentId: comment.comment.id,
        })
      );
    },
  });

  const disabled = !isAuthenticated || isPending;

  const handleReplySubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!editor) {
      return;
    }
    if (editor.isEmpty) {
      toast.error("Comment cannot be empty");

      return;
    }

    const content = editor.getValue();

    mutate({
      articleId: comment.comment.articleId,
      content,
      parentId: comment.comment.id,
    });
  };

  return (
    <form onSubmit={handleReplySubmit}>
      <CommentEditor
        disabled={disabled}
        editor={editor}
        onChange={setEditor}
        placeholder={"Reply to comment"}
      />

      <div className="mt-2 space-x-1">
        <Button
          aria-disabled={disabled || !editor || editor.isEmpty}
          className="h-8 px-2 font-medium text-xs"
          disabled={disabled || !editor || editor.isEmpty}
          type="submit"
          variant="secondary"
        >
          Reply
        </Button>
        <Button
          className="h-8 px-2 font-medium text-xs"
          onClick={() => setIsReplying(false)}
          type="button"
          variant="secondary"
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
