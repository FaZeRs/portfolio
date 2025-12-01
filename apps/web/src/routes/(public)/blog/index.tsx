import { siteConfig } from "@acme/config";
import { Skeleton } from "@acme/ui/skeleton";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import FilteredArticles from "~/components/blog/filtered-articles";
import PageHeading from "~/components/page-heading";
import { seo } from "~/lib/seo";
import { useTRPC } from "~/lib/trpc";
import { getBaseUrl } from "~/lib/utils";

export const Route = createFileRoute("/(public)/blog/")({
  component: RouteComponent,
  loader: async ({ context: { trpc, queryClient } }) =>
    await queryClient.prefetchQuery(trpc.blog.allPublic.queryOptions()),
  head: () => {
    const seoData = seo({
      title: `Blog | ${siteConfig.title}`,
      description:
        "I write about my experiences and learnings in the software development world.",
      keywords: siteConfig.keywords,
      url: `${getBaseUrl()}/blog`,
      canonical: `${getBaseUrl()}/blog`,
    });
    return {
      meta: seoData.meta,
      links: seoData.links,
    };
  },
});

function BlogSkeleton() {
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
    data: articles,
    isLoading,
    isFetching,
  } = useSuspenseQuery(trpc.blog.allPublic.queryOptions());

  return (
    <>
      <PageHeading
        description={`On my blog, I have written ${articles.length} items in total. In the search box below, you can look for articles by title.`}
        title="Blog"
      />

      {isLoading || isFetching ? (
        <BlogSkeleton />
      ) : (
        <FilteredArticles articles={articles} />
      )}
    </>
  );
}
