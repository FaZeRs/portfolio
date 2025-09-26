import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { Loader2Icon, MoreVerticalIcon } from "lucide-react";
import { toast } from "sonner";

import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { authQueryOptions } from "~/lib/auth/queries";
import { useTRPC } from "~/trpc/react";
import { CommentType } from "~/types";

type CommentMenuProps = {
  comment: CommentType;
};

export default function CommentMenu({ comment }: Readonly<CommentMenuProps>) {
  const { data: currentUser } = useSuspenseQuery(authQueryOptions());
  const isAuthenticated = Boolean(currentUser);
  const { id, userId, articleId } = comment;

  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    ...trpc.comment.delete.mutationOptions(),
    onSuccess: () => toast.success("Deleted a comment"),
    onError: (error) => toast.error(error.message),
    onSettled: () =>
      queryClient.invalidateQueries(
        trpc.comment.all.queryOptions({
          articleId,
        })
      ),
  });

  return (
    <Dialog>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            aria-label="Open menu"
            className="size-8"
            size="icon"
            type="button"
            variant="ghost"
          >
            <MoreVerticalIcon className="size-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {/*
            Radix Dialog + DropdownMenu bug 🥺
            https://github.com/radix-ui/primitives/issues/1836
          */}
          <DialogTrigger asChild>
            {isAuthenticated &&
            (currentUser?.id === userId || currentUser?.role === "admin") ? (
              <DropdownMenuItem
                aria-disabled={isPending}
                className="text-red-600 focus:text-red-500"
                disabled={isPending}
              >
                Delete
              </DropdownMenuItem>
            ) : null}
          </DialogTrigger>
        </DropdownMenuContent>
      </DropdownMenu>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete a comment</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this comment? This action cannot be
            undone.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <DialogClose>Cancel</DialogClose>
          <Button
            disabled={isPending}
            onClick={() => mutate({ id })}
            variant="destructive"
          >
            {isPending ? (
              <Loader2Icon className="size-4 animate-spin" />
            ) : (
              "Delete"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
