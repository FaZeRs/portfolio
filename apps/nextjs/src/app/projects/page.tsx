import type { Metadata } from "next";

import { projectsData } from "~/constants/projects-data";
import PageHeading from "../_components/page-heading";
import Projects from "../_components/projects";

export const metadata: Metadata = {
  title: "Projects",
};

export default function ProjectsPage() {
  return (
    <>
      <PageHeading
        title="Projects"
        description="Several projects that I have worked on, both private and open source."
      />

      <Projects projects={projectsData} />
    </>
  );
}
