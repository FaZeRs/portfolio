import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { toast } from "sonner";
import { z } from "zod";
import { ProjectsForm } from "~/lib/components/projects/form";
import { UpdateProjectSchema } from "~/lib/server/schema";
import { useTRPC } from "~/trpc/react";

export const Route = createFileRoute(
  "/_dashboardLayout/dashboard/projects/$projectId/edit",
)({
  component: ProjectsEditPage,
  loader: async ({ context: { trpc, queryClient }, params }) => {
    console.log(params.projectId);
    const project = await queryClient.fetchQuery(
      trpc.project.byId.queryOptions({ id: params.projectId }),
    );
    return { project };
  },
});

function ProjectsEditPage() {
  const { project } = Route.useLoaderData();

  const router = useRouter();
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const updateProjectMutation = useMutation({
    ...trpc.project.update.mutationOptions(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["project"] });
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
      id: project?.id ?? "",
    });
  };

  return (
    <ProjectsForm<z.infer<typeof UpdateProjectSchema>>
      project={project}
      handleSubmit={handleFormSubmit}
      isSubmitting={updateProjectMutation.isPending}
    />
  );
}
