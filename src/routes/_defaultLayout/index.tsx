import { createFileRoute } from "@tanstack/react-router";

import Contact from "~/components/contact";
import ExperienceSection from "~/components/experience";
import Intro from "~/components/intro";
import SkillSection from "~/components/skills";

export const Route = createFileRoute("/_defaultLayout/")({
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
