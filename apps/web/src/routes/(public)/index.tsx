import { createFileRoute } from "@tanstack/react-router";
import CTASection from "~/components/cta-section";
import FeaturedProjects from "~/components/featured-projects";
import Hero from "~/components/hero";
import NewsletterSection from "~/components/newsletter-section";
import ServicesSection from "~/components/services/services";
import TrustIndicators from "~/components/trust-indicators";

export const Route = createFileRoute("/(public)/")({
  component: Home,
  loader: async ({ context: { trpc, queryClient } }) => {
    await Promise.all([
      queryClient.prefetchQuery(trpc.project.allPublic.queryOptions()),
      queryClient.prefetchQuery(trpc.service.allPublic.queryOptions()),
    ]);
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
