import { createFileRoute } from "@tanstack/react-router";
import PageHeading from "~/lib/components/page-heading";
import ProjectContent from "~/lib/components/project-content";
import { projectsData } from "~/lib/constants/projects-data";

export const Route = createFileRoute("/_defaultLayout/projects/$projectId")({
  loader: ({ params: { projectId } }) =>
    projectsData.find((project) => project.slug === projectId),
  component: RouteComponent,
});

function RouteComponent() {
  const project = Route.useLoaderData();

  if (!project) {
    return <div>Project not found</div>;
  }

  return (
    <div>
      <PageHeading title={project.title} description={project.description} />
      <ProjectContent project={project} />
    </div>
  );
}
