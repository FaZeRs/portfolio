import { motion } from "framer-motion";

import { slideInWithFadeOut } from "~/lib/constants/framer-motion-variants";
import { ProjectType } from "~/types";
import ProjectCard from "./project-card";

interface ProjectsProps {
  projects: ProjectType[];
}

export default function Projects({ projects }: Readonly<ProjectsProps>) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={slideInWithFadeOut}
      className="grid grid-cols-1 gap-8 sm:grid-cols-2"
    >
      {projects.map((project) => (
        <ProjectCard key={project.slug} project={project} />
      ))}
    </motion.div>
  );
}
