import { siteConfig } from "@acme/config";
import { createFileRoute } from "@tanstack/react-router";
import ConnectSection from "~/components/connect-section";
import FeaturedProjects from "~/components/featured-projects";
import PersonalHero from "~/components/personal-hero";
import RecentPosts from "~/components/recent-posts";
import { queryKeys } from "~/lib/query-keys";
import { seo } from "~/lib/seo";
import { $getAllPublicArticles, $getAllPublicProjects } from "~/lib/server";
import {
  generateStructuredDataGraph,
  getHomepageSchemas,
} from "~/lib/structured-data";

export const Route = createFileRoute("/(public)/")({
  component: Home,
  loader: async ({ context: { queryClient } }) => {
    await Promise.all([
      queryClient.prefetchQuery({
        queryKey: queryKeys.project.listPublic(),
        queryFn: () => $getAllPublicProjects(),
      }),
      queryClient.prefetchQuery({
        queryKey: queryKeys.blog.listPublic(),
        queryFn: () => $getAllPublicArticles(),
      }),
    ]);
  },
  head: () => {
    const seoData = seo({
      title: siteConfig.title,
      description: siteConfig.description,
      keywords: siteConfig.keywords,
    });
    const structuredData = generateStructuredDataGraph(getHomepageSchemas());
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

function Home() {
  return (
    <>
      <PersonalHero />
      <div className="flex flex-col items-center space-y-16 pb-16 sm:space-y-24 sm:pb-24">
        <RecentPosts />
        <FeaturedProjects />
        <ConnectSection />
      </div>
    </>
  );
}
