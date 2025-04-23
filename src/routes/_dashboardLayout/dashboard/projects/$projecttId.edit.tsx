import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { ProjectsForm } from "~/lib/components/projects/form";
import { useTRPC } from "~/trpc/react";

export const Route = createFileRoute(
  "/_dashboardLayout/dashboard/projects/$projecttId/edit",
)({
  component: ProjectsEditPage,
  loader: ({ context }) => {
    return { user: context.user };
  },
});

function ProjectsEditPage() {
  const trpc = useTRPC();
  const projectQuery = useQuery(trpc.project.byId.queryOptions({ id }));

  if (projectQuery.isLoading) {
    return <div>Loading...</div>;
  }

  if (projectQuery.isError) {
    return <div>Error: {projectQuery.error.message}</div>;
  }

  if (!projectQuery.data) {
    return <div>Project not found</div>;
  }

  return <ProjectsForm />;
}
