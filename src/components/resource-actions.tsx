import { useMutation } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { Loader2, MoreHorizontal } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

interface ResourceActionsProps {
  id: string;
  title: string;
  resourceType: "project" | "experience" | "snippet";
  viewPath?: string;
  editPath: string;
  trpcDeleteMutation: {
    mutationFn: (id: string) => Promise<unknown>;
    invalidateQuery: () => Promise<void>;
  };
}

export function ResourceActions({
  id,
  title,
  resourceType,
  viewPath,
  editPath,
  trpcDeleteMutation,
}: Readonly<ResourceActionsProps>) {
  const router = useRouter();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const deleteMutation = useMutation({
    mutationFn: () => trpcDeleteMutation.mutationFn(id),
    onSuccess: async () => {
      await trpcDeleteMutation.invalidateQuery();
      toast.success(
        `${resourceType.charAt(0).toUpperCase() + resourceType.slice(1)} "${title}" deleted successfully`,
      );
    },
    onError: (error) => {
      console.error(`Error deleting ${resourceType} "${title}":`, error);
      toast.error(
        error instanceof Error
          ? error.message
          : `Failed to delete ${resourceType} "${title}"`,
      );
    },
  });

  const handleDelete = () => {
    deleteMutation.mutate();
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
          {viewPath && (
            <DropdownMenuItem
              onClick={() => router.navigate({ to: viewPath })}
              disabled={deleteMutation.isPending}
            >
              View
            </DropdownMenuItem>
          )}
          <DropdownMenuItem
            onClick={() => router.navigate({ to: editPath })}
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
              This action cannot be undone. This will permanently delete the{" "}
              {resourceType} "{title}".
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
              {deleteMutation.isPending && (
                <Loader2 className="h-4 w-4 animate-spin" />
              )}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
