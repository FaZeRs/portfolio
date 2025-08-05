import { useMutation, useQueryClient } from "@tanstack/react-query";
import { MoreVerticalIcon } from "lucide-react";
import { useCopyToClipboard } from "react-use";
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
import { useCurrentUser } from "~/hooks/use-current-user";
import { useTRPC } from "~/trpc/react";
import { CommentType, UserType } from "~/types";

interface CommentMenuProps {
  comment: CommentType & { user: UserType };
  slug: string;
}

export default function CommentMenu({
  comment,
  slug,
}: Readonly<CommentMenuProps>) {
  const { user } = useCurrentUser();
  const [_, copyToClipboard] = useCopyToClipboard();
  const { parentId, id, userId } = comment;
  const commentIdentifier = parentId
    ? `comment-${parentId}-${id}`
    : `comment-${id}`;

  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    ...trpc.comment.delete.mutationOptions(),
    onSuccess: () => toast.success("Deleted a comment"),
    onError: (error) => toast.error(error.message),
    onSettled: () =>
      queryClient.invalidateQueries(
        trpc.comment.all.queryOptions({ articleId: comment.articleId }),
      ),
  });

  const copyUrl = () => {
    copyToClipboard(
      `${window.location.origin}/blog/${slug}#${commentIdentifier}`,
    );
    toast.success("Link copied to clipboard");
  };

  return (
    <Dialog>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="size-8"
            aria-label="Open menu"
            type="button"
          >
            <MoreVerticalIcon className="size-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={copyUrl}>Copy link</DropdownMenuItem>
          {/*
            Radix Dialog + DropdownMenu bug 🥺
            https://github.com/radix-ui/primitives/issues/1836
          */}
          <DialogTrigger asChild>
            {user?.id === userId ? (
              <DropdownMenuItem
                className="text-red-600 focus:text-red-500"
                disabled={isPending}
                aria-disabled={isPending}
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
          <Button variant="destructive" onClick={() => mutate({ id })}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
