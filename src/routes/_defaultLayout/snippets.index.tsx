import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import PageHeading from "~/components/page-heading";
import Snippets from "~/components/snippets";
import { Skeleton } from "~/components/ui/skeleton";
import { siteConfig } from "~/lib/config/site";
import { seo } from "~/lib/seo";
import { useTRPC } from "~/trpc/react";

export const Route = createFileRoute("/_defaultLayout/snippets/")({
  component: RouteComponent,
  loader: async ({ context: { trpc, queryClient } }) =>
    await queryClient.prefetchQuery(trpc.snippet.allPublic.queryOptions()),
  head: () => ({
    meta: seo({
      title: `Snippets | ${siteConfig.title}`,
      description: "A collection of code snippets that I use in my projects.",
      keywords: siteConfig.keywords,
    }),
  }),
});

function SnippetsSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
      <Skeleton className="h-[400px] w-full rounded-md" />
      <Skeleton className="h-[400px] w-full rounded-md" />
      <Skeleton className="h-[400px] w-full rounded-md" />
      <Skeleton className="h-[400px] w-full rounded-md" />
    </div>
  );
}

function RouteComponent() {
  const trpc = useTRPC();
  const {
    data: snippets,
    isLoading,
    isFetching,
  } = useSuspenseQuery(trpc.snippet.allPublic.queryOptions());

  return (
    <>
      <PageHeading
        title="Snippets"
        description="A collection of code snippets that I use in my projects."
      />
      {isLoading || isFetching ? (
        <SnippetsSkeleton />
      ) : (
        <Snippets snippets={snippets} />
      )}
    </>
  );
}
