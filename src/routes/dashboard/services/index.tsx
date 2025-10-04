import { ErrorBoundary } from "@sentry/tanstackstart-react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { Suspense } from "react";

import { DataTable } from "~/components/data-table/data-table";
import { serviceColumns } from "~/components/services/columns";
import { buttonVariants } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { Skeleton } from "~/components/ui/skeleton";
import { cn } from "~/lib/utils";
import { useTRPC } from "~/trpc/react";

export const Route = createFileRoute("/dashboard/services/")({
  component: Services,
  loader: async ({ context: { trpc, queryClient } }) =>
    await queryClient.prefetchQuery(trpc.service.all.queryOptions()),
  head: () => ({
    meta: [
      { title: "Services | Dashboard" },
      { name: "description", content: "Manage your portfolio services" },
    ],
  }),
});

function ServicesLoading() {
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

function ServicesError() {
  return (
    <Card className="p-6">
      <div className="text-center">
        <h3 className="font-medium text-destructive text-lg">
          Failed to load services
        </h3>
        <p className="mt-1 text-muted-foreground text-sm">
          Please try again later.
        </p>
      </div>
    </Card>
  );
}

function ServicesContent() {
  const trpc = useTRPC();
  const {
    data: services,
    error,
    isLoading,
    isFetching,
  } = useSuspenseQuery(trpc.service.all.queryOptions());

  if (error) {
    return (
      <Card className="p-6">
        <div className="text-center">
          <h3 className="font-medium text-destructive text-lg">
            Failed to load services
          </h3>
          <p className="mt-1 text-muted-foreground text-sm">
            {error.message ?? "Please try again later."}
          </p>
        </div>
      </Card>
    );
  }

  if (isLoading || isFetching) {
    return <ServicesLoading />;
  }

  return <DataTable columns={serviceColumns} data={services} />;
}

function Services() {
  return (
    <>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-bold text-2xl tracking-tight">Service List</h2>
          <p className="text-muted-foreground">Manage your services here.</p>
        </div>
        <Link
          aria-label="Add new service"
          className={cn(buttonVariants({ variant: "default" }), "group")}
          to="/dashboard/services/create"
        >
          <span>Add Service</span> <Plus className="ml-1" size={18} />
        </Link>
      </div>
      <ErrorBoundary fallback={<ServicesError />}>
        <Suspense fallback={<ServicesLoading />}>
          <ServicesContent />
        </Suspense>
      </ErrorBoundary>
    </>
  );
}
