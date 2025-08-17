import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ClientOnly } from "@tanstack/react-router";
import { SendIcon } from "lucide-react";
import { FormEvent } from "react";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import { useCurrentUser } from "~/hooks/use-current-user";
import { useSignInModal } from "~/hooks/use-sign-in-modal";
import { useTRPC } from "~/trpc/react";
import CommentEditor, { useCommentEditor } from "./comment-editor";

type CommentFormProps = {
  articleId: string;
};

export default function CommentForm({ articleId }: Readonly<CommentFormProps>) {
  const [editor, setEditor] = useCommentEditor();

  const { isAuthenticated, isPending: isSessionPending } = useCurrentUser();

  const { setOpen } = useSignInModal();
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    ...trpc.comment.create.mutationOptions(),
    onSuccess: () => {
      if (editor) {
        editor.clearValue();
      }
      toast.success("Comment posted");
    },
    onError: (error) => {
      toast.error(error.message);
      // biome-ignore lint/suspicious/noConsole: logging error
      console.error(error);
    },
    onSettled: async () => {
      await queryClient.invalidateQueries(
        trpc.comment.all.queryOptions({ articleId })
      );
    },
  });

  const disabled = !isAuthenticated || isPending;

  const handlePostComment = (event: FormEvent<HTMLFormElement>) => {
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
      articleId,
      content,
    });
  };

  return (
    <form className="mt-6" onSubmit={handlePostComment}>
      <div className="relative">
        <CommentEditor
          disabled={disabled}
          editor={editor}
          onChange={setEditor}
          placeholder={"Leave comment"}
        />

        <Button
          aria-disabled={disabled || !editor || editor.isEmpty}
          aria-label="Send comment"
          className="absolute right-2 bottom-1.5 size-7"
          disabled={disabled || !editor || editor.isEmpty}
          size="icon"
          type="submit"
          variant="ghost"
        >
          <SendIcon className="size-4" />
        </Button>

        <ClientOnly>
          {isAuthenticated || isSessionPending ? null : (
            <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-black/5 backdrop-blur-[0.8px]">
              <Button onClick={() => setOpen(true)} type="button">
                Please sign in to comment
              </Button>
            </div>
          )}
        </ClientOnly>
      </div>
    </form>
  );
}
