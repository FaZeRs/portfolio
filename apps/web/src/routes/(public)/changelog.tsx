import { siteConfig } from "@acme/config";
import { CustomMDX } from "@acme/mdx";
import { TOC } from "@acme/types";
import { Skeleton } from "@acme/ui/skeleton";
import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Suspense } from "react";
import TableOfContents from "~/components/blog/toc";
import PageHeading from "~/components/page-heading";
import { seo } from "~/lib/seo";
import { getBaseUrl } from "~/lib/utils";

export const Route = createFileRoute("/(public)/changelog")({
  component: RouteComponent,
  loader: async () => {
    const response = await fetch(`${getBaseUrl()}/api/changelog`);
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

      <div className="relative lg:gap-10 xl:grid xl:max-w-6xl xl:grid-cols-[1fr_250px] 2xl:max-w-7xl">
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
          <motion.div
            animate={{ opacity: 1, x: 0 }}
            className="hidden text-sm xl:block"
            initial={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="-mt-10 sticky top-20 pt-10">
              <TableOfContents toc={toc} />
            </div>
          </motion.div>
        )}
      </div>
    </>
  );
}
