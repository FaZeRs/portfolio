import { createFileRoute } from "@tanstack/react-router";
import { ProjectsForm } from "~/lib/components/projects/form";

export const Route = createFileRoute("/_dashboardLayout/dashboard/projects/create")({
  component: ProjectsCreatePage,
  loader: ({ context }) => {
    return { user: context.user };
  },
});

function ProjectsCreatePage() {
  return <ProjectsForm />;
}
