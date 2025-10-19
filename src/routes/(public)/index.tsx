import { createFileRoute } from "@tanstack/react-router";
import BlogSection from "~/components/blog/articles";
import CTASection from "~/components/cta-section";
import ExperienceSection from "~/components/experiences/experience";
import Intro from "~/components/intro";
import ServicesSection from "~/components/services/services";
import SkillSection from "~/components/skills";

export const Route = createFileRoute("/(public)/")({
  component: Home,
  loader: async ({ context: { trpc, queryClient } }) => {
    await queryClient.prefetchQuery(trpc.experience.allPublic.queryOptions());
    await queryClient.prefetchQuery(trpc.blog.allPublic.queryOptions());
    await queryClient.prefetchQuery(trpc.service.allPublic.queryOptions());
  },
});

function Home() {
  return (
    <>
      <Intro />
      <div className="mt-20 mb-20 flex flex-col items-center space-y-40">
        <BlogSection />
        <ServicesSection />
        <SkillSection />
        <ExperienceSection />
        <CTASection />
      </div>
    </>
  );
}
