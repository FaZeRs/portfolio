import { createFileRoute } from "@tanstack/react-router";
import PageHeading from "~/lib/components/page-heading";
import Projects from "~/lib/components/projects";
import { projectsData } from "~/lib/constants/projects-data";

export const Route = createFileRoute("/projects/")({
  component: RouteComponent,
});

function RouteComponent() {
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
