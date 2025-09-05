import { ToolProject } from "~/lib/ai";
import { ProjectCard } from "./project-card";

export function ProjectList({
  projects,
}: Readonly<{ projects: ToolProject[] }>) {
  return (
    <div className="grid grid-cols-1 gap-3">
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
}
