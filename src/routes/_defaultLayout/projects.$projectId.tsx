import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, ErrorComponent, notFound } from "@tanstack/react-router";
import { TRPCClientError } from "@trpc/client";
import { NotFound } from "~/lib/components/not-found";
import PageHeading from "~/lib/components/page-heading";
import ProjectContent from "~/lib/components/project-content";
import { useTRPC } from "~/trpc/react";

export const Route = createFileRoute("/_defaultLayout/projects/$projectId")({
  loader: async ({ params: { projectId }, context: { trpc, queryClient } }) => {
    try {
      const data = await queryClient.ensureQueryData(
        trpc.project.bySlug.queryOptions({ slug: projectId }),
      );
      return { title: data?.title, description: data?.description };
    } catch (error) {
      if (error instanceof TRPCClientError && error.data.code === "NOT_FOUND") {
        throw notFound();
      }
      throw error;
    }
  },
  head: ({ loaderData }) => ({
    meta: [{ title: `${loaderData.title}`, description: loaderData.description }],
  }),
  component: RouteComponent,
  errorComponent: ({ error }) => <ErrorComponent error={error} />,
  notFoundComponent: () => {
    return <NotFound>Project not found</NotFound>;
  },
});

function RouteComponent() {
  const { projectId } = Route.useParams();
  const trpc = useTRPC();
  const project = useSuspenseQuery(trpc.project.bySlug.queryOptions({ slug: projectId }));

  return (
    <div>
      <PageHeading title={project.data?.title} description={project.data?.description} />
      <ProjectContent project={project.data} />
    </div>
  );
}
