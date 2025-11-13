import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense } from "react";
import TableOfContents from "~/components/blog/toc";
import PageHeading from "~/components/page-heading";
import { Skeleton } from "~/components/ui/skeleton";
import { siteConfig } from "~/lib/config/site";
import { seo } from "~/lib/seo";
import { getBaseUrl } from "~/lib/utils";
import { TOC } from "~/types";

const CustomMDX = lazy(() => import("~/components/mdx/mdx"));

export const Route = createFileRoute("/(public)/changelog")({
  component: RouteComponent,
  loader: async () => {
    const response = await fetch("/api/changelog");
    if (!response.ok) {
      throw new Error("Failed to load changelog");
    }
    const data = (await response.json()) as { content: string; toc: TOC[] };
    return { content: data.content, toc: data.toc ?? [] };
  },
  head: () => {
    const keywords = [
      ...siteConfig.keywords.split(",").map((k) => k.trim()),
      "changelog",
      "updates",
      "releases",
    ].join(", ");

    const seoData = seo({
      title: `Changelog | ${siteConfig.title}`,
      description: "All notable changes and updates to this portfolio website.",
      keywords,
      url: `${getBaseUrl()}/changelog`,
      canonical: `${getBaseUrl()}/changelog`,
    });
    return {
      meta: seoData.meta,
      links: seoData.links,
    };
  },
});

function RouteComponent() {
  const { content, toc } = Route.useLoaderData();

  return (
    <>
      <PageHeading
        description="All notable changes and updates to this portfolio website."
        title="Changelog"
      />

      <div className="relative lg:gap-10 xl:grid xl:max-w-6xl xl:grid-cols-[1fr_250px]">
        <div className="w-full min-w-0">
          <div className="prose prose-slate dark:prose-invert max-w-none">
            <Suspense
              fallback={
                <div className="space-y-4">
                  <Skeleton className="h-8 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              }
            >
              <CustomMDX source={content} />
            </Suspense>
          </div>
        </div>
        {toc.length > 0 && (
          <div className="hidden text-sm xl:block">
            <div className="-mt-10 sticky top-16 max-h-[calc(var(--vh)-4rem)] pt-10">
              <TableOfContents toc={toc} />
            </div>
          </div>
        )}
      </div>
    </>
  );
}
