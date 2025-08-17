import { ErrorBoundary } from "@sentry/tanstackstart-react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { Suspense } from "react";

import { DataTable } from "~/components/data-table/data-table";
import { projectColumns } from "~/components/projects/columns";
import { buttonVariants } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { Skeleton } from "~/components/ui/skeleton";
import { cn } from "~/lib/utils";
import { useTRPC } from "~/trpc/react";

export const Route = createFileRoute("/_dashboardLayout/dashboard/projects/")({
  component: Projects,
  loader: async ({ context: { trpc, queryClient } }) =>
    await queryClient.prefetchQuery(trpc.project.all.queryOptions()),
  head: () => ({
    meta: [
      { title: "Projects | Dashboard" },
      { name: "description", content: "Manage your portfolio projects" },
    ],
  }),
});

function ProjectsLoading() {
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

function ProjectsError() {
  return (
    <Card className="p-6">
      <div className="text-center">
        <h3 className="font-medium text-destructive text-lg">
          Failed to load projects
        </h3>
        <p className="mt-1 text-muted-foreground text-sm">
          Please try again later.
        </p>
      </div>
    </Card>
  );
}

function ProjectsContent() {
  const trpc = useTRPC();
  const {
    data: projects,
    error,
    isLoading,
    isFetching,
  } = useSuspenseQuery(trpc.project.all.queryOptions());

  if (error) {
    return (
      <Card className="p-6">
        <div className="text-center">
          <h3 className="font-medium text-destructive text-lg">
            Failed to load projects
          </h3>
          <p className="mt-1 text-muted-foreground text-sm">
            {error.message ?? "Please try again later."}
          </p>
        </div>
      </Card>
    );
  }

  if (isLoading || isFetching) {
    return <ProjectsLoading />;
  }

  return <DataTable columns={projectColumns} data={projects} />;
}

function Projects() {
  return (
    <>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-bold text-2xl tracking-tight">Project List</h2>
          <p className="text-muted-foreground">Manage your projects here.</p>
        </div>
        <Link
          aria-label="Add new project"
          className={cn(buttonVariants({ variant: "default" }), "group")}
          to="/dashboard/projects/create"
        >
          <span>Add Project</span> <Plus className="ml-1" size={18} />
        </Link>
      </div>
      <ErrorBoundary fallback={<ProjectsError />}>
        <Suspense fallback={<ProjectsLoading />}>
          <ProjectsContent />
        </Suspense>
      </ErrorBoundary>
    </>
  );
}
