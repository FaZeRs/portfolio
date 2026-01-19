import { CreateEmailSubscriberSchema } from "@acme/db/schema";
import { cn } from "@acme/ui";
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
import { Badge } from "@acme/ui/badge";
import { Button, buttonVariants } from "@acme/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@acme/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@acme/ui/dialog";
import { useAppForm } from "@acme/ui/form";
import { Input } from "@acme/ui/input";
import { Progress } from "@acme/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@acme/ui/table";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { format } from "date-fns";
import {
  ArrowLeft,
  CheckCircle,
  Mail,
  Plus,
  Trash,
  UserMinus,
  Users,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useTRPC } from "~/lib/trpc";

export const Route = createFileRoute(
  "/(dashboard)/marketing/email/subscribers/"
)({
  component: SubscribersPage,
  head: () => ({
    meta: [{ title: "Email Subscribers | Email Marketing" }],
  }),
  loader: async ({ context: { trpc, queryClient } }) => {
    await queryClient.prefetchQuery(
      trpc.emailMarketing.getAllSubscribers.queryOptions()
    );
  },
});

function SubscribersPage() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [subscriberToDelete, setSubscriberToDelete] = useState<string | null>(
    null
  );

  const { data: subscribers } = useSuspenseQuery(
    trpc.emailMarketing.getAllSubscribers.queryOptions()
  );

  const createSubscriberMutation = useMutation({
    ...trpc.emailMarketing.createSubscriber.mutationOptions(),
    onSuccess: async () => {
      await queryClient.invalidateQueries(trpc.emailMarketing.pathFilter());
      toast.success("Subscriber added successfully");
      form.reset();
      setIsDialogOpen(false);
    },
    onError: () => {
      toast.error("Failed to add subscriber");
    },
  });

  const deleteSubscriberMutation = useMutation({
    ...trpc.emailMarketing.deleteSubscriber.mutationOptions(),
    onSuccess: async () => {
      await queryClient.invalidateQueries(trpc.emailMarketing.pathFilter());
      toast.success("Subscriber deleted successfully");
    },
    onError: () => {
      toast.error("Failed to delete subscriber");
    },
  });

  const form = useAppForm({
    defaultValues: {
      email: "",
      name: "",
    },
    validators: {
      onChange: CreateEmailSubscriberSchema,
    },
    onSubmit: ({ value }) => {
      createSubscriberMutation.mutate(value);
    },
  });

  const activeCount = subscribers.filter((s) => s.isActive).length;
  const inactiveCount = subscribers.length - activeCount;
  const activePercentage =
    subscribers.length > 0
      ? Math.round((activeCount / subscribers.length) * 100)
      : 0;

  const handleDelete = (id: string) => {
    setSubscriberToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (subscriberToDelete) {
      deleteSubscriberMutation.mutate({ id: subscriberToDelete });
    }
    setDeleteDialogOpen(false);
    setSubscriberToDelete(null);
  };

  return (
    <>
      {/* Header */}
      <div className="mb-4">
        <Link
          className={cn(
            buttonVariants({ variant: "ghost", size: "sm" }),
            "mb-4"
          )}
          to="/marketing/email"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Email Marketing
        </Link>

        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="font-bold text-2xl tracking-tight">
              Email Subscribers
            </h2>
            <p className="text-muted-foreground">
              Manage your email subscriber list
            </p>
          </div>

          <Dialog onOpenChange={setIsDialogOpen} open={isDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Subscriber
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Subscriber</DialogTitle>
                <DialogDescription>
                  Add a new email subscriber to your list
                </DialogDescription>
              </DialogHeader>

              <form.AppForm>
                <form
                  className="space-y-4"
                  onSubmit={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    form.handleSubmit();
                  }}
                >
                  <div className="space-y-2">
                    <form.AppField name="email">
                      {(field) => (
                        <field.FormItem>
                          <field.FormLabel>Email</field.FormLabel>
                          <div className="relative">
                            <Mail className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 text-muted-foreground" />
                            <Input
                              className="pl-10"
                              id={field.name}
                              onBlur={field.handleBlur}
                              onChange={(e) =>
                                field.handleChange(e.target.value)
                              }
                              placeholder="subscriber@example.com"
                              type="email"
                              value={field.state.value}
                            />
                          </div>
                          <field.FormMessage />
                        </field.FormItem>
                      )}
                    </form.AppField>
                  </div>

                  <div className="space-y-2">
                    <form.AppField name="name">
                      {(field) => (
                        <field.FormItem>
                          <field.FormLabel>Name (Optional)</field.FormLabel>
                          <Input
                            id={field.name}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.target.value)}
                            placeholder="John Doe"
                            value={field.state.value ?? ""}
                          />
                          <field.FormMessage />
                        </field.FormItem>
                      )}
                    </form.AppField>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button
                      className="flex-1"
                      disabled={createSubscriberMutation.isPending}
                      type="submit"
                    >
                      {createSubscriberMutation.isPending
                        ? "Adding..."
                        : "Add Subscriber"}
                    </Button>
                    <Button
                      onClick={() => setIsDialogOpen(false)}
                      type="button"
                      variant="outline"
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </form.AppForm>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="mb-6 grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">
              Total Subscribers
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">{subscribers.length}</div>
            <p className="text-muted-foreground text-xs">
              All time subscribers
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">
              Active Subscribers
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-3">
              <div className="font-bold text-2xl">{activeCount}</div>
              <div className="flex items-center gap-1 pb-1 text-muted-foreground text-sm">
                <span className="font-medium">{activePercentage}%</span>
                <span>active</span>
              </div>
            </div>
            <Progress className="mt-3 h-2" value={activePercentage} />
            {inactiveCount > 0 && (
              <p className="mt-2 flex items-center gap-1 text-muted-foreground text-xs">
                <UserMinus className="h-3 w-3" />
                {inactiveCount} unsubscribed
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Subscribers Table */}
      <Card>
        <CardHeader>
          <CardTitle>Subscribers</CardTitle>
          <CardDescription>
            All email subscribers in your database
          </CardDescription>
        </CardHeader>
        <CardContent>
          {subscribers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="mb-6 rounded-full bg-muted p-4">
                <Mail className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="mb-2 font-semibold text-lg">No subscribers yet</h3>
              <p className="mb-6 max-w-sm text-center text-muted-foreground text-sm">
                Add your first subscriber or share your newsletter to start
                building your audience
              </p>
              <Button onClick={() => setIsDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Subscriber
              </Button>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Subscriber</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Subscribed</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {subscribers.map((subscriber) => (
                    <TableRow className="group" key={subscriber.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 font-medium text-primary text-sm">
                            {subscriber.email?.[0]?.toUpperCase() ?? "?"}
                          </div>
                          <div>
                            <p className="font-medium">{subscriber.email}</p>
                            {subscriber.name && (
                              <p className="text-muted-foreground text-sm">
                                {subscriber.name}
                              </p>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          className="gap-1"
                          variant={
                            subscriber.isActive ? "default" : "secondary"
                          }
                        >
                          {subscriber.isActive ? (
                            <CheckCircle className="h-3 w-3" />
                          ) : (
                            <UserMinus className="h-3 w-3" />
                          )}
                          {subscriber.isActive ? "Active" : "Unsubscribed"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {format(
                          new Date(subscriber.subscribedAt),
                          "MMM d, yyyy"
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          className="opacity-0 transition-opacity group-hover:opacity-100"
                          onClick={() => handleDelete(subscriber.id)}
                          size="sm"
                          variant="ghost"
                        >
                          <Trash className="h-4 w-4 text-destructive" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <AlertDialog onOpenChange={setDeleteDialogOpen} open={deleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Subscriber</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this subscriber? This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={confirmDelete}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
