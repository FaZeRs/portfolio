import { useSuspenseQuery } from "@tanstack/react-query";
import {
  createFileRoute,
  ErrorComponent,
  notFound,
} from "@tanstack/react-router";
import { TRPCClientError } from "@trpc/client";
import { NotFound } from "~/components/not-found";
import PageHeading from "~/components/page-heading";
import ProjectContent from "~/components/projects/project-content";
import { siteConfig } from "~/lib/config/site";
import { seo } from "~/lib/seo";
import { useTRPC } from "~/trpc/react";

export const Route = createFileRoute("/(public)/projects/$projectId")({
  loader: async ({ params: { projectId }, context: { trpc, queryClient } }) => {
    try {
      const data = await queryClient.ensureQueryData(
        trpc.project.bySlug.queryOptions({ slug: projectId })
      );
      return {
        title: data?.title,
        description: data?.description,
        image: data?.imageUrl,
      };
    } catch (error) {
      if (
        error instanceof TRPCClientError &&
        error.data?.code === "NOT_FOUND"
      ) {
        throw notFound();
      }
      throw error;
    }
  },
  head: ({ loaderData }) => ({
    meta: seo({
      title: `${loaderData?.title} | ${siteConfig.title}`,
      description: loaderData?.description,
      keywords: siteConfig.keywords,
      image: loaderData?.image,
    }),
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
  const project = useSuspenseQuery(
    trpc.project.bySlug.queryOptions({ slug: projectId })
  );

  return (
    <div>
      <PageHeading
        description={project.data?.description}
        title={project.data?.title}
      />
      <ProjectContent project={project.data} />
    </div>
  );
}
