import { useQueryClient } from "@tanstack/react-query";
import { createFileRoute, redirect, useRouter } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { getWebRequest } from "@tanstack/react-start/server";
import {
  CalendarIcon,
  ClockIcon,
  EditIcon,
  LogOutIcon,
  MailIcon,
  ShieldIcon,
  TrashIcon,
  UserIcon,
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
import { Skeleton } from "~/components/ui/skeleton";
import { useCurrentUser } from "~/hooks/use-current-user";
import authClient from "~/lib/auth-client";
import { auth } from "~/lib/server/auth";

const getCurrentUser = createServerFn({ method: "GET" }).handler(async () => {
  const { headers } = getWebRequest();

  const session = await auth.api.getSession({
    headers,
    query: {
      disableCookieCache: true,
    },
  });

  if (!session) {
    throw new Error("Unauthorized");
  }

  return { user: session.user };
});

export const Route = createFileRoute("/_defaultLayout/profile")({
  component: ProfilePage,
  beforeLoad: async ({ context }) => {
    if (!context.user) {
      throw redirect({ to: "/signin" });
    }
  },
  loader: async () => {
    const result = await getCurrentUser();
    return result;
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

function ProfilePage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user, isAuthenticated, isPending } = useCurrentUser();
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [editForm, setEditForm] = useState({
    name: user?.name || "",
  });

  if (isPending) {
    return <ProfileSkeleton />;
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center space-y-4">
        <div className="space-y-2 text-center">
          <h1 className="font-semibold text-2xl">Access Denied</h1>
          <p className="text-muted-foreground">
            You need to be logged in to view your profile.
          </p>
        </div>
        <Button onClick={() => router.navigate({ to: "/signin" })}>
          Sign In
        </Button>
      </div>
    );
  }

  const getInitials = (name: string) => {
    return name
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase();
  };

  const handleEditSubmit = async () => {
    try {
      const newName = editForm.name.trim();
      if (!newName || newName === user.name) {
        toast.info("No changes to save");
        setIsEditing(false);
        return;
      }
      await authClient.updateUser({
        name: newName,
      });
      await queryClient.invalidateQueries({ queryKey: ["user"] });
      await router.invalidate();
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error("Failed to update profile");
      console.error("Profile update error:", error);
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
      toast.error("Failed to delete account");
      console.error("Account deletion error:", error);
    }
  };

  const handleSignOut = async () => {
    try {
      await authClient.signOut();
      await queryClient.invalidateQueries({ queryKey: ["user"] });
      await router.navigate({ to: "/" });
      await router.invalidate();
      toast.success("Signed out successfully");
    } catch (error) {
      toast.error("Failed to sign out");
      console.error("Sign out error:", error);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeading
        title="Profile"
        description="Manage your account settings and preferences"
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
                <AvatarImage src={user.image || ""} alt={user.name} />
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
              open={isEditing}
              onOpenChange={(open) => {
                setIsEditing(open);
                if (open) {
                  setEditForm({ name: user.name });
                }
              }}
            >
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full justify-start">
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
                      value={editForm.name}
                      onChange={(e) =>
                        setEditForm((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }
                      placeholder="Enter your name"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                  <Button
                    onClick={handleEditSubmit}
                    disabled={
                      editForm.name.trim().length === 0 ||
                      editForm.name.trim() === user.name.trim()
                    }
                  >
                    Save Changes
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={handleSignOut}
            >
              <LogOutIcon className="mr-2 h-4 w-4" />
              Sign Out
            </Button>

            <Separator />

            <AlertDialog open={isDeleting} onOpenChange={setIsDeleting}>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="w-full justify-start">
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
                    onClick={handleDeleteAccount}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
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

function ProfileSkeleton() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-96" />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-64" />
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center space-x-4">
              <Skeleton className="h-16 w-16 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-4 w-20" />
              </div>
            </div>
            <Separator />
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-3">
                  <Skeleton className="h-4 w-4" />
                  <div className="space-y-1">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-64" />
          </CardHeader>
          <CardContent className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
