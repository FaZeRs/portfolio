import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@acme/ui/alert-dialog";
import { Button } from "@acme/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@acme/ui/dropdown-menu";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { Loader2, MoreHorizontal } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

type ResourceActionsProps = {
  id: string;
  title: string;
  resourceType: "project" | "experience" | "snippet" | "blog" | "service";
  viewPath?: string;
  editPath: string;
  trpcDeleteMutation: {
    mutationFn: (id: string) => Promise<unknown>;
    invalidateQuery: () => Promise<void>;
  };
};

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
        `${resourceType.charAt(0).toUpperCase() + resourceType.slice(1)} "${title}" deleted successfully`
      );
    },
    onError: (error) => {
      toast.error(
        error instanceof Error
          ? error.message
          : `Failed to delete ${resourceType} "${title}"`
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
            aria-label={`Actions for ${title}`}
            className="h-8 w-8 p-0"
            variant="ghost"
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          {viewPath && (
            <DropdownMenuItem
              disabled={deleteMutation.isPending}
              onClick={() => router.navigate({ to: viewPath })}
            >
              View
            </DropdownMenuItem>
          )}
          <DropdownMenuItem
            disabled={deleteMutation.isPending}
            onClick={() => router.navigate({ to: editPath })}
          >
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem
            className="text-destructive focus:text-destructive"
            disabled={deleteMutation.isPending}
            onClick={() => setShowDeleteDialog(true)}
          >
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog onOpenChange={setShowDeleteDialog} open={showDeleteDialog}>
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
              className="gap-2"
              disabled={deleteMutation.isPending}
              onClick={handleDelete}
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
