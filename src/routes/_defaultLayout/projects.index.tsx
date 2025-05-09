import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import PageHeading from "~/lib/components/page-heading";
import Projects from "~/lib/components/projects";
import { Skeleton } from "~/lib/components/ui/skeleton";
import { useTRPC } from "~/trpc/react";

export const Route = createFileRoute("/_defaultLayout/projects/")({
  component: RouteComponent,
  loader: async ({ context: { trpc, queryClient } }) =>
    await queryClient.prefetchQuery(trpc.project.allPublic.queryOptions()),
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
        title="Projects"
        description="Several projects that I have worked on, both private and open source."
      />
      {isLoading || isFetching ? <ProjectsSkeleton /> : <Projects projects={projects} />}
    </>
  );
}
