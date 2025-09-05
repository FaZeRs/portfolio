import { ToolExperience } from "~/lib/ai";
import { ExperienceCard } from "./experience-card";

export function ExperienceList({
  experiences,
}: {
  experiences: ToolExperience[];
}) {
  return (
    <div className="grid grid-cols-1 gap-3">
      {experiences.map((experience) => (
        <ExperienceCard experience={experience} key={experience.id} />
      ))}
    </div>
  );
}
