import Contact from "./_components/contact";
import ExperienceSection from "./_components/experience";
import Intro from "./_components/intro";
import SkillSection from "./_components/skills";

export default function HomePage() {
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
