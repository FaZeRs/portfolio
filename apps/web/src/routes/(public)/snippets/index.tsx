import { siteConfig } from "@acme/config";
import { Skeleton } from "@acme/ui/skeleton";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import PageHeading from "~/components/page-heading";
import Snippets from "~/components/snippets";
import { seo } from "~/lib/seo";
import { useTRPC } from "~/lib/trpc";
import { getBaseUrl } from "~/lib/utils";

export const Route = createFileRoute("/(public)/snippets/")({
  component: RouteComponent,
  loader: async ({ context: { trpc, queryClient } }) =>
    await queryClient.prefetchQuery(trpc.snippet.allPublic.queryOptions()),
  head: () => {
    const seoData = seo({
      title: `Snippets | ${siteConfig.title}`,
      description: "A collection of code snippets that I use in my projects.",
      keywords: siteConfig.keywords,
      url: `${getBaseUrl()}/snippets`,
      canonical: `${getBaseUrl()}/snippets`,
    });
    return {
      meta: seoData.meta,
      links: seoData.links,
    };
  },
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
        description="A collection of code snippets that I use in my projects."
        title="Snippets"
      />
      {isLoading || isFetching ? (
        <SnippetsSkeleton />
      ) : (
        <Snippets snippets={snippets} />
      )}
    </>
  );
}
