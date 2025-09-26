import { useRouter } from "@tanstack/react-router";
import { MoreHorizontal } from "lucide-react";
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
} from "~/components/ui/alert-dialog";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import authClient from "~/lib/auth/auth-client";
import { UserType } from "~/types";

type DataTableRowActionsProps = {
  user: UserType;
};

export function Actions({ user }: Readonly<DataTableRowActionsProps>) {
  const router = useRouter();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showBanDialog, setShowBanDialog] = useState(false);
  const [banReason, setBanReason] = useState("");
  const [banExpiresIn, setBanExpiresIn] = useState("");
  const isAdmin = user.role === "admin";
  const [isDeleting, setIsDeleting] = useState(false);
  const [isBanning, setIsBanning] = useState(false);
  const [isImpersonating, setIsImpersonating] = useState(false);

  const handleDelete = async () => {
    if (isDeleting) {
      return;
    }
    try {
      setIsDeleting(true);
      const { error } = await authClient.admin.removeUser({ userId: user.id });
      if (error) {
        toast.error(error.message);
        return;
      }
      toast.success("User deleted successfully");
      setShowDeleteDialog(false);
      await router.invalidate();
    } catch {
      toast.error("Failed to delete user");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleImpersonate = async () => {
    if (isImpersonating) {
      return;
    }
    try {
      setIsImpersonating(true);
      const { error } = await authClient.admin.impersonateUser({
        userId: user.id,
      });
      if (error) {
        toast.error(error.message);
        return;
      }

      toast.success("User impersonated successfully");
      await router.invalidate();
    } catch {
      toast.error("Failed to impersonate user");
    } finally {
      setIsImpersonating(false);
    }
  };

  const handleBan = async () => {
    if (isBanning) {
      return;
    }
    if (!banReason.trim()) {
      toast.error("Please provide a ban reason");
      return;
    }

    const expiresInSeconds = Number.parseInt(banExpiresIn, 10) || 0;
    if (expiresInSeconds < 0) {
      toast.error("Expiration time must be a positive number");
      return;
    }
    try {
      setIsBanning(true);
      const { error } = await authClient.admin.banUser({
        userId: user.id,
        banReason: banReason.trim(),
        banExpiresIn: expiresInSeconds,
      });
      if (error) {
        toast.error(error.message);
        return;
      }
      toast.success("User banned successfully");
      setShowBanDialog(false);
      setBanReason("");
      setBanExpiresIn("");
      await router.invalidate();
    } catch {
      toast.error("Failed to ban user");
    } finally {
      setIsBanning(false);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            aria-label={`Actions for ${user.name}`}
            className="h-8 w-8 p-0"
            variant="ghost"
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem
            disabled={isAdmin || isImpersonating}
            onClick={handleImpersonate}
          >
            Impersonate User
          </DropdownMenuItem>
          <DropdownMenuItem
            disabled={isAdmin || isBanning}
            onClick={() => setShowBanDialog(true)}
          >
            Ban User
          </DropdownMenuItem>

          <DropdownMenuItem
            className="text-destructive focus:text-destructive"
            disabled={isAdmin || isDeleting}
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
              user "{user.name}".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="gap-2"
              disabled={isDeleting}
              onClick={handleDelete}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog onOpenChange={setShowBanDialog} open={showBanDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Ban User</AlertDialogTitle>
            <AlertDialogDescription>
              This will ban the user "{user.name}". Please provide a reason and
              optional expiration time.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label className="font-medium text-sm" htmlFor="ban-reason">
                Ban Reason
              </Label>
              <Input
                id="ban-reason"
                onChange={(e) => setBanReason(e.target.value)}
                placeholder="Enter ban reason..."
                required
                type="text"
                value={banReason}
              />
            </div>
            <div className="space-y-2">
              <Label className="font-medium text-sm" htmlFor="ban-expires">
                Expires In (seconds)
              </Label>
              <Input
                id="ban-expires"
                min="0"
                onChange={(e) => setBanExpiresIn(e.target.value)}
                placeholder="0 = permanent ban"
                type="number"
                value={banExpiresIn}
              />
            </div>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                setBanReason("");
                setBanExpiresIn("");
              }}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="gap-2"
              disabled={isBanning}
              onClick={handleBan}
            >
              {isBanning ? "Banning..." : "Ban User"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
