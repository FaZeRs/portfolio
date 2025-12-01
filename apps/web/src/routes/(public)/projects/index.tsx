import { siteConfig } from "@acme/config";
import { Skeleton } from "@acme/ui/skeleton";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import PageHeading from "~/components/page-heading";
import Projects from "~/components/projects/projects";
import { seo } from "~/lib/seo";
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
        "Several projects that I have worked on, both private and open source.",
      keywords: siteConfig.keywords,
      url: `${getBaseUrl()}/projects`,
      canonical: `${getBaseUrl()}/projects`,
    });
    return {
      meta: seoData.meta,
      links: seoData.links,
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
