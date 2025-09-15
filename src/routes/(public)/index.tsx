import { createFileRoute } from "@tanstack/react-router";
import BlogSection from "~/components/blog/articles";

import Contact from "~/components/contact";
import ExperienceSection from "~/components/experiences/experience";
import Intro from "~/components/intro";
import SkillSection from "~/components/skills";

export const Route = createFileRoute("/(public)/")({
  component: Home,
  loader: async ({ context: { trpc, queryClient } }) => {
    await queryClient.prefetchQuery(trpc.experience.allPublic.queryOptions());
    await queryClient.prefetchQuery(trpc.blog.allPublic.queryOptions());
  },
});

function Home() {
  return (
    <>
      <Intro />
      <div className="mb-20 flex flex-col items-center space-y-40">
        <BlogSection />
        <SkillSection />
        <ExperienceSection />
        <Contact />
      </div>
    </>
  );
}
