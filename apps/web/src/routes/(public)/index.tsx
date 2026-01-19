import { siteConfig } from "@acme/config";
import { createFileRoute } from "@tanstack/react-router";
import CTASection from "~/components/cta-section";
import FeaturedProjects from "~/components/featured-projects";
import Hero from "~/components/hero";
import NewsletterSection from "~/components/newsletter-section";
import ServicesSection from "~/components/services/services";
import TrustIndicators from "~/components/trust-indicators";
import { seo } from "~/lib/seo";
import {
  generateStructuredDataGraph,
  getHomepageSchemas,
} from "~/lib/structured-data";

export const Route = createFileRoute("/(public)/")({
  component: Home,
  loader: async ({ context: { trpc, queryClient } }) => {
    await Promise.all([
      queryClient.prefetchQuery(trpc.project.allPublic.queryOptions()),
      queryClient.prefetchQuery(trpc.service.allPublic.queryOptions()),
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
      <Hero />
      <div className="flex flex-col items-center space-y-16 pb-16 sm:space-y-24 sm:pb-24">
        <TrustIndicators />
        <ServicesSection />
        <FeaturedProjects />
        <NewsletterSection />
        <CTASection />
      </div>
    </>
  );
}
