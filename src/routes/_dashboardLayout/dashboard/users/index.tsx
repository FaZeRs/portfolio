import { ErrorBoundary } from "@sentry/tanstackstart-react";
import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { getWebRequest } from "@tanstack/react-start/server";
import { Suspense } from "react";

import { DataTable } from "~/components/data-table/data-table";
import { Card } from "~/components/ui/card";
import { Skeleton } from "~/components/ui/skeleton";
import { userColumns } from "~/components/users/columns";
import { auth } from "~/lib/server/auth";
import { UserType } from "~/types";

const getUsers = createServerFn({ method: "GET" }).handler(async () => {
  const { headers } = getWebRequest();

  const data = await auth.api.listUsers({
    query: {
      sortBy: "createdAt",
      sortDirection: "desc",
    },
    headers,
  });

  return { users: data.users };
});

export const Route = createFileRoute("/_dashboardLayout/dashboard/users/")({
  component: Users,
  loader: async () => {
    const result = await getUsers();
    return result;
  },
  head: () => ({
    meta: [
      { title: "Users | Dashboard" },
      { name: "description", content: "Manage your portfolio users" },
    ],
  }),
});

function UsersLoading() {
  return (
    <div className="space-y-3">
      <Skeleton className="h-8 w-[250px]" />
      <Skeleton className="h-4 w-[350px]" />
      <div className="mt-6">
        <Skeleton className="h-[400px] w-full rounded-md" />
      </div>
    </div>
  );
}

function UsersError() {
  return (
    <Card className="p-6">
      <div className="text-center">
        <h3 className="font-medium text-destructive text-lg">
          Failed to load users
        </h3>
        <p className="mt-1 text-muted-foreground text-sm">
          Please try again later.
        </p>
      </div>
    </Card>
  );
}

function UsersContent() {
  const { users } = Route.useLoaderData();

  return <DataTable columns={userColumns} data={users as UserType[]} />;
}

function Users() {
  return (
    <>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-bold text-2xl tracking-tight">User List</h2>
          <p className="text-muted-foreground">Manage your users here.</p>
        </div>
      </div>
      <ErrorBoundary fallback={<UsersError />}>
        <Suspense fallback={<UsersLoading />}>
          <UsersContent />
        </Suspense>
      </ErrorBoundary>
    </>
  );
}
