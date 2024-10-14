import { HydrateClient } from "~/trpc/server";
import ExperienceSection from "./_components/experience";
import Intro from "./_components/intro";
import SkillSection from "./_components/skills";

export const runtime = "edge";

export default function HomePage() {
  return (
    <HydrateClient>
      <Intro />
      <div className="mb-20 flex flex-col items-center space-y-40">
        <SkillSection />
        <ExperienceSection />
      </div>
    </HydrateClient>
  );
}
