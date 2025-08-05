import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ClientOnly } from "@tanstack/react-router";
import { FormEvent } from "react";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import { useCommentContext } from "~/contexts/comment";
import { useCurrentUser } from "~/hooks/use-current-user";
import { useTRPC } from "~/trpc/react";
import CommentEditor, { useCommentEditor } from "./comment-editor";

export default function CommentReply() {
  const [editor, setEditor] = useCommentEditor();
  const { comment, setIsReplying } = useCommentContext();
  const { isAuthenticated } = useCurrentUser();

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
      console.error("Error posting comment reply:", error);
      toast.error(error.message);
    },
    onSettled: async () => {
      await queryClient.invalidateQueries(
        trpc.comment.all.queryOptions({
          articleId: comment.comment.articleId,
          parentId: comment.comment.id,
        }),
      );
    },
  });

  const disabled = !isAuthenticated || isPending;

  const handleReplySubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!editor) return;
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
      <ClientOnly>
        <CommentEditor
          editor={editor}
          onChange={setEditor}
          placeholder={"Reply to comment"}
          disabled={disabled}
        />
      </ClientOnly>

      <div className="mt-2 space-x-1">
        <Button
          variant="secondary"
          className="h-8 px-2 font-medium text-xs"
          type="submit"
          disabled={disabled || !editor || editor.isEmpty}
          aria-disabled={disabled || !editor || editor.isEmpty}
        >
          Reply
        </Button>
        <Button
          variant="secondary"
          className="h-8 px-2 font-medium text-xs"
          type="button"
          onClick={() => setIsReplying(false)}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
