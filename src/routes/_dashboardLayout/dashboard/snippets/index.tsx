import { ErrorBoundary } from "@sentry/tanstackstart-react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { Suspense } from "react";

import { DataTable } from "~/components/data-table/data-table";
import { snippetColumns } from "~/components/snippets/columns";
import { buttonVariants } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { Skeleton } from "~/components/ui/skeleton";
import { cn } from "~/lib/utils";
import { useTRPC } from "~/trpc/react";

export const Route = createFileRoute("/_dashboardLayout/dashboard/snippets/")({
  component: Snippets,
  loader: async ({ context: { trpc, queryClient } }) =>
    await queryClient.prefetchQuery(trpc.snippet.all.queryOptions()),
  head: () => ({
    meta: [
      { title: "Snippets | Dashboard" },
      { name: "description", content: "Manage your portfolio snippets" },
    ],
  }),
});

function SnippetsLoading() {
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

function SnippetsError() {
  return (
    <Card className="p-6">
      <div className="text-center">
        <h3 className="font-medium text-destructive text-lg">
          Failed to load snippets
        </h3>
        <p className="mt-1 text-muted-foreground text-sm">
          Please try again later.
        </p>
      </div>
    </Card>
  );
}

function SnippetsContent() {
  const trpc = useTRPC();
  const {
    data: snippets,
    error,
    isLoading,
    isFetching,
  } = useSuspenseQuery(trpc.snippet.all.queryOptions());

  if (error) {
    return (
      <Card className="p-6">
        <div className="text-center">
          <h3 className="font-medium text-destructive text-lg">
            Failed to load snippets
          </h3>
          <p className="mt-1 text-muted-foreground text-sm">
            {error.message ?? "Please try again later."}
          </p>
        </div>
      </Card>
    );
  }

  if (isLoading || isFetching) {
    return <SnippetsLoading />;
  }

  return <DataTable columns={snippetColumns} data={snippets} />;
}

function Snippets() {
  return (
    <>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-bold text-2xl tracking-tight">Snippet List</h2>
          <p className="text-muted-foreground">Manage your snippets here.</p>
        </div>
        <Link
          to="/dashboard/snippets/create"
          className={cn(buttonVariants({ variant: "default" }), "group")}
          aria-label="Add new snippet"
        >
          <span>Add Snippet</span> <Plus className="ml-1" size={18} />
        </Link>
      </div>
      <ErrorBoundary fallback={<SnippetsError />}>
        <Suspense fallback={<SnippetsLoading />}>
          <SnippetsContent />
        </Suspense>
      </ErrorBoundary>
    </>
  );
}
