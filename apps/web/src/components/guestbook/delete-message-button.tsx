import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@acme/ui/alert-dialog";
import { Button, buttonVariants } from "@acme/ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Trash2Icon } from "lucide-react";
import { toast } from "sonner";
import { useTRPC } from "~/lib/trpc";

type DeleteMessageButtonProps = {
  messageId: string;
};

export default function DeleteMessageButton({
  messageId,
}: Readonly<DeleteMessageButtonProps>) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMutation({
    ...trpc.guestbook.delete.mutationOptions(),
    onSuccess: () => toast.success("Deleted a message"),
    onError: (error) => toast.error(error.message),
    onSettled: () =>
      queryClient.invalidateQueries(trpc.guestbook.all.queryOptions()),
  });

  const handleDeleteMessage = async (id: string) => {
    const toastId = toast.loading("Deleting your message ...");
    try {
      await mutateAsync({ id });
    } finally {
      toast.dismiss(toastId);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          aria-disabled={isPending}
          aria-label="Delete message"
          className="hidden size-8 group-hover:flex"
          disabled={isPending}
          size="icon"
          type="button"
          variant="destructive"
        >
          <Trash2Icon aria-hidden="true" className="size-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete a comment</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this comment? This action cannot be
            undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className={buttonVariants({ variant: "destructive" })}
            onClick={() => handleDeleteMessage(messageId)}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
