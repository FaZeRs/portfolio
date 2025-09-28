import { useQueryClient } from "@tanstack/react-query";
import { createFileRoute, redirect, useRouter } from "@tanstack/react-router";
import {
  CalendarIcon,
  ClockIcon,
  EditIcon,
  LogOutIcon,
  MailIcon,
  ShieldIcon,
  TrashIcon,
  UserIcon,
  X,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import PageHeading from "~/components/page-heading";
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
} from "~/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Separator } from "~/components/ui/separator";
import authClient from "~/lib/auth/auth-client";

export const Route = createFileRoute("/(public)/profile")({
  component: ProfilePage,
  beforeLoad: ({ context }) => {
    if (!context.user) {
      throw redirect({ to: "/signin" });
    }
  },
  head: () => ({
    meta: [
      { title: "Profile" },
      {
        name: "description",
        content: "Manage your profile and account settings",
      },
    ],
  }),
});

const getInitials = (name: string) => {
  return (
    name
      .trim()
      // biome-ignore lint/performance/useTopLevelRegex: valid regex
      .split(/\s+/)
      .filter(Boolean)
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
  );
};

const AT_SYMBOL_REGEX = /^@/;

function ProfilePage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user } = Route.useRouteContext();

  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [editForm, setEditForm] = useState({
    name: user?.name || "",
    twitterHandle: user?.twitterHandle || "",
  });

  const handleEditSubmit = async () => {
    try {
      const newName = editForm.name.trim();
      const newTwitterHandle = editForm.twitterHandle.trim();

      if (
        (!newName || newName === user.name) &&
        (!newTwitterHandle || newTwitterHandle === (user.twitterHandle || ""))
      ) {
        toast.info("No changes to save");
        setIsEditing(false);
        return;
      }

      await authClient.updateUser({
        name: newName,
        twitterHandle: newTwitterHandle || null,
      });
      await queryClient.invalidateQueries({ queryKey: ["user"] });
      await router.invalidate();
      toast.success("Profile updated successfully");
    } catch (error) {
      // biome-ignore lint/suspicious/noConsole: log error
      console.error(error);
      toast.error("Failed to update profile");
    } finally {
      setIsEditing(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await authClient.deleteUser({
        callbackURL: "/",
      });
      toast.success("Account deleted successfully");
    } catch (error) {
      // biome-ignore lint/suspicious/noConsole: log error
      console.error(error);
      toast.error("Failed to delete account");
    }
  };

  const handleSignOut = async () => {
    try {
      await authClient.signOut();
      await queryClient.invalidateQueries({ queryKey: ["user"] });
      await router.navigate({ to: "/" });
      await router.invalidate();
      toast.success("Signed out successfully");
    } catch (_error) {
      toast.error("Failed to sign out");
    }
  };

  return (
    <div className="space-y-6">
      <PageHeading
        description="Manage your account settings and preferences"
        title="Profile"
      />

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserIcon className="h-5 w-5" />
              Profile Information
            </CardTitle>
            <CardDescription>
              Your personal information and account details
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center space-x-4">
              <Avatar className="h-16 w-16">
                <AvatarImage alt={user.name} src={user.image || ""} />
                <AvatarFallback className="text-lg">
                  {getInitials(user.name)}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <h3 className="font-semibold text-lg">{user.name}</h3>
                <div className="flex items-center gap-2">
                  <Badge
                    variant={user.role === "admin" ? "default" : "secondary"}
                  >
                    <ShieldIcon className="mr-1 h-3 w-3" />
                    {user.role || "user"}
                  </Badge>
                  {user.emailVerified && (
                    <Badge variant="outline">
                      <MailIcon className="mr-1 h-3 w-3" />
                      Verified
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <MailIcon className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="font-medium text-sm">Email</p>
                  <p className="text-muted-foreground text-sm">{user.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="font-medium text-sm">Member since</p>
                  <p className="text-muted-foreground text-sm">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <ClockIcon className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="font-medium text-sm">Last updated</p>
                  <p className="text-muted-foreground text-sm">
                    {new Date(user.updatedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {user.twitterHandle && (
                <div className="flex items-center gap-3">
                  <X className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium text-sm">Twitter</p>
                    <a
                      className="text-blue-600 text-sm underline hover:text-blue-800"
                      href={`https://twitter.com/${user.twitterHandle}`}
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      @{user.twitterHandle}
                    </a>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Account Actions</CardTitle>
            <CardDescription>
              Manage your account settings and preferences
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Dialog
              onOpenChange={(open) => {
                setIsEditing(open);
                if (open) {
                  setEditForm({
                    name: user.name,
                    twitterHandle: user.twitterHandle || "",
                  });
                }
              }}
              open={isEditing}
            >
              <DialogTrigger asChild>
                <Button className="w-full justify-start" variant="outline">
                  <EditIcon className="mr-2 h-4 w-4" />
                  Edit Profile
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit Profile</DialogTitle>
                  <DialogDescription>
                    Update your personal information
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      onChange={(e) =>
                        setEditForm((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }
                      placeholder="Enter your name"
                      value={editForm.name}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="twitterHandle">Twitter Handle</Label>
                    <Input
                      id="twitterHandle"
                      onChange={(e) =>
                        setEditForm((prev) => ({
                          ...prev,
                          twitterHandle: e.target.value.replace(
                            AT_SYMBOL_REGEX,
                            ""
                          ),
                        }))
                      }
                      placeholder="Enter your Twitter handle (without @)"
                      value={editForm.twitterHandle}
                    />
                    <p className="text-muted-foreground text-xs">
                      Enter your Twitter handle without the @ symbol
                    </p>
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={() => setIsEditing(false)} variant="outline">
                    Cancel
                  </Button>
                  <Button
                    disabled={
                      editForm.name.trim().length === 0 ||
                      (editForm.name.trim() === user.name.trim() &&
                        editForm.twitterHandle.trim() ===
                          (user.twitterHandle || "").trim())
                    }
                    onClick={handleEditSubmit}
                  >
                    Save Changes
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Button
              className="w-full justify-start"
              onClick={handleSignOut}
              variant="outline"
            >
              <LogOutIcon className="mr-2 h-4 w-4" />
              Sign Out
            </Button>

            <Separator />

            <AlertDialog onOpenChange={setIsDeleting} open={isDeleting}>
              <AlertDialogTrigger asChild>
                <Button className="w-full justify-start" variant="destructive">
                  <TrashIcon className="mr-2 h-4 w-4" />
                  Delete Account
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    your account and remove all your data from our servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    onClick={handleDeleteAccount}
                  >
                    Delete Account
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
