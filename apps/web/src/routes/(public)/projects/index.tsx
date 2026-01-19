import { siteConfig } from "@acme/config";
import { Skeleton } from "@acme/ui/skeleton";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import PageHeading from "~/components/page-heading";
import Projects from "~/components/projects/projects";
import { seo } from "~/lib/seo";
import {
  generateStructuredDataGraph,
  getProjectListSchemas,
} from "~/lib/structured-data";
import { useTRPC } from "~/lib/trpc";
import { getBaseUrl } from "~/lib/utils";

export const Route = createFileRoute("/(public)/projects/")({
  component: RouteComponent,
  loader: async ({ context: { trpc, queryClient } }) =>
    await queryClient.prefetchQuery(trpc.project.allPublic.queryOptions()),
  head: () => {
    const seoData = seo({
      title: `Projects | ${siteConfig.title}`,
      description:
        "Portfolio of custom websites, web applications, and business software solutions. See real examples of scalable, high-performance projects delivered for clients.",
      keywords:
        "Web Development Portfolio, Custom Website Examples, Business Software Projects, React Applications, Full-Stack Development Work, Client Projects",
      url: `${getBaseUrl()}/projects`,
      canonical: `${getBaseUrl()}/projects`,
    });
    const structuredData = generateStructuredDataGraph(getProjectListSchemas());

    return {
      meta: seoData.meta,
      links: seoData.links,
      scripts: [
        {
          type: "application/ld+json",
          children: structuredData,
        },
      ],
    };
  },
});

function ProjectsSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
      <Skeleton className="h-[400px] w-full rounded-md" />
      <Skeleton className="h-[400px] w-full rounded-md" />
      <Skeleton className="h-[400px] w-full rounded-md" />
      <Skeleton className="h-[400px] w-full rounded-md" />
    </div>
  );
}

function RouteComponent() {
  const trpc = useTRPC();
  const {
    data: projects,
    isLoading,
    isFetching,
  } = useSuspenseQuery(trpc.project.allPublic.queryOptions());

  return (
    <>
      <PageHeading
        description="Several projects that I have worked on, both private and open source."
        title="Projects"
      />
      {isLoading || isFetching ? (
        <ProjectsSkeleton />
      ) : (
        <Projects projects={projects} />
      )}
    </>
  );
}
