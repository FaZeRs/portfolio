import { ErrorBoundary } from "@sentry/tanstackstart-react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { Suspense } from "react";

import { blogColumns } from "~/components/blog/columns";
import { DataTable } from "~/components/data-table/data-table";
import { buttonVariants } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { Skeleton } from "~/components/ui/skeleton";
import { cn } from "~/lib/utils";
import { useTRPC } from "~/trpc/react";

export const Route = createFileRoute("/dashboard/blog/")({
  component: Articles,
  loader: async ({ context: { trpc, queryClient } }) =>
    await queryClient.prefetchQuery(trpc.blog.all.queryOptions()),
  head: () => ({
    meta: [
      { title: "Blog | Dashboard" },
      { name: "description", content: "Manage your portfolio blog" },
    ],
  }),
});

function ArticlesLoading() {
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

function ArticlesError() {
  return (
    <Card className="p-6">
      <div className="text-center">
        <h3 className="font-medium text-destructive text-lg">
          Failed to load articles
        </h3>
        <p className="mt-1 text-muted-foreground text-sm">
          Please try again later.
        </p>
      </div>
    </Card>
  );
}

function ArticlesContent() {
  const trpc = useTRPC();
  const {
    data: articles,
    error,
    isLoading,
    isFetching,
  } = useSuspenseQuery(trpc.blog.all.queryOptions());

  if (error) {
    return <ArticlesError />;
  }

  if (isLoading || isFetching) {
    return <ArticlesLoading />;
  }

  return <DataTable columns={blogColumns} data={articles} />;
}

function Articles() {
  return (
    <>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-bold text-2xl tracking-tight">Article List</h2>
          <p className="text-muted-foreground">Manage your articles here.</p>
        </div>
        <Link
          aria-label="Add new article"
          className={cn(buttonVariants({ variant: "default" }), "group")}
          to="/dashboard/blog/create"
        >
          <span>Add Article</span> <Plus className="ml-1" size={18} />
        </Link>
      </div>
      <ErrorBoundary fallback={<ArticlesError />}>
        <Suspense fallback={<ArticlesLoading />}>
          <ArticlesContent />
        </Suspense>
      </ErrorBoundary>
    </>
  );
}
