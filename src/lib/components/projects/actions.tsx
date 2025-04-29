import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { Loader2, MoreHorizontal } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useTRPC } from "~/trpc/react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

interface DataTableRowActionsProps {
  id: string;
  slug: string;
  title: string;
}

export function Actions({ id, slug, title }: Readonly<DataTableRowActionsProps>) {
  const router = useRouter();
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const deleteMutation = useMutation({
    ...trpc.project.delete.mutationOptions(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [["project", "all"]] });
      toast.success(`Project "${title}" deleted successfully`);
    },
    onError: (error) => {
      console.error(`Error deleting project "${title}":`, error);
      toast.error(
        error instanceof Error ? error.message : `Failed to delete project "${title}"`,
      );
    },
  });

  const handleDelete = () => {
    deleteMutation.mutate(id);
    setShowDeleteDialog(false);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="h-8 w-8 p-0"
            aria-label={`Actions for ${title}`}
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem
            onClick={() => router.navigate({ to: `/projects/${slug}` })}
            disabled={deleteMutation.isPending}
          >
            View
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => router.navigate({ to: `/dashboard/projects/${id}/edit` })}
            disabled={deleteMutation.isPending}
          >
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setShowDeleteDialog(true)}
            disabled={deleteMutation.isPending}
            className="text-destructive focus:text-destructive"
          >
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the project "
              {title}".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteMutation.isPending}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
              className="gap-2"
            >
              {deleteMutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
