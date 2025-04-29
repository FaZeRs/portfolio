import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, ErrorComponent, useRouter } from "@tanstack/react-router";
import { toast } from "sonner";
import { z } from "zod";
import { NotFound } from "~/lib/components/not-found";
import { ProjectsForm } from "~/lib/components/projects/form";
import { UpdateProjectSchema } from "~/lib/server/schema";
import { useTRPC } from "~/trpc/react";

export const Route = createFileRoute(
  "/_dashboardLayout/dashboard/projects/$projectId/edit",
)({
  component: ProjectsEditPage,
  loader: async ({ params: { projectId }, context: { trpc, queryClient } }) => {
    const data = await queryClient.ensureQueryData(
      trpc.project.byId.queryOptions({ id: projectId }),
    );

    return { title: data?.title };
  },
  head: ({ loaderData }) => ({
    meta: [{ title: `Edit Project: ${loaderData.title}` }],
  }),
  errorComponent: ({ error }) => <ErrorComponent error={error} />,
  notFoundComponent: () => {
    return <NotFound>Project not found</NotFound>;
  },
});

function ProjectsEditPage() {
  const { projectId } = Route.useParams();
  const trpc = useTRPC();

  const project = useSuspenseQuery(trpc.project.byId.queryOptions({ id: projectId }));

  const router = useRouter();
  const queryClient = useQueryClient();
  const projectAllQueryKey = trpc.project.all.queryKey();

  const updateProjectMutation = useMutation({
    ...trpc.project.update.mutationOptions(),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [projectAllQueryKey[0]],
        refetchType: "all",
      });
      toast.success("Project updated successfully");
      router.navigate({ to: "/dashboard/projects" });
    },
    onError: (error) => {
      console.error("Error updating project:", error);
      toast.error("Failed to update project");
    },
  });

  const handleFormSubmit = (data: z.infer<typeof UpdateProjectSchema>) => {
    updateProjectMutation.mutate({
      ...data,
      id: project.data?.id ?? "",
    });
  };

  return (
    <>
      <div className="mb-2 flex flex-wrap items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Edit Project</h2>
          <p className="text-muted-foreground">Update your project details below.</p>
        </div>
      </div>
      <div className="py-4">
        <ProjectsForm<z.infer<typeof UpdateProjectSchema>>
          project={project.data}
          handleSubmit={handleFormSubmit}
          isSubmitting={updateProjectMutation.isPending}
          schema={UpdateProjectSchema}
        />
      </div>
    </>
  );
}
