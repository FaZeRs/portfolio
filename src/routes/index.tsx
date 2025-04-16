import { createFileRoute } from "@tanstack/react-router";

import Contact from "~/lib/components/contact";
import ExperienceSection from "~/lib/components/experience";
import Intro from "~/lib/components/intro";
import SkillSection from "~/lib/components/skills";

export const Route = createFileRoute("/")({
  component: Home,
  loader: ({ context }) => {
    return { user: context.user };
  },
});

function Home() {
  return (
    <>
      <Intro />
      <div className="mb-20 flex flex-col items-center space-y-40">
        <SkillSection />
        <ExperienceSection />
        <Contact />
      </div>
    </>
  );
}
