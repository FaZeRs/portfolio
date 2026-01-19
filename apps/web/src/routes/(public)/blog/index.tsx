import { siteConfig } from "@acme/config";
import { Skeleton } from "@acme/ui/skeleton";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import FilteredArticles from "~/components/blog/filtered-articles";
import PageHeading from "~/components/page-heading";
import { seo } from "~/lib/seo";
import {
  generateStructuredDataGraph,
  getBlogListSchemas,
} from "~/lib/structured-data";
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
        "Expert insights on web development, React, TypeScript, and building scalable business applications. Learn best practices for modern software development.",
      keywords:
        "Web Development Blog, React Tutorials, TypeScript Best Practices, Software Development Tips, Business Application Development, Full-Stack Development Guide",
      url: `${getBaseUrl()}/blog`,
      canonical: `${getBaseUrl()}/blog`,
    });
    const structuredData = generateStructuredDataGraph(getBlogListSchemas());

    return {
      meta: seoData.meta,
      links: seoData.links,
      scripts: [
        {
          type: "application/ld+json",
          children: structuredData,
        },
      ],
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
