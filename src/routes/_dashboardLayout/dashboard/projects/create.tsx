import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { toast } from "sonner";
import { z } from "zod";
import { ProjectsForm } from "~/lib/components/projects/form";
import { CreateProjectSchema } from "~/lib/server/schema";
import { useTRPC } from "~/trpc/react";

export const Route = createFileRoute("/_dashboardLayout/dashboard/projects/create")({
  component: ProjectsCreatePage,
});

function ProjectsCreatePage() {
  const router = useRouter();
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const createProjectMutation = useMutation({
    ...trpc.project.create.mutationOptions(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["project"] });
      toast.success("Project created successfully");
      router.navigate({ to: "/dashboard/projects" });
    },
    onError: (error) => {
      console.error("Error creating project:", error);
      toast.error("Failed to create project");
    },
  });

  const handleFormSubmit = (data: z.infer<typeof CreateProjectSchema>) => {
    createProjectMutation.mutate(data);
  };

  return (
    <>
      <div className="mb-2 flex flex-wrap items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Create Project</h2>
          <p className="text-muted-foreground">Create a new project here.</p>
        </div>
      </div>
      <div className="py-4">
        <ProjectsForm<z.infer<typeof CreateProjectSchema>>
          handleSubmit={handleFormSubmit}
          isSubmitting={createProjectMutation.isPending}
        />
      </div>
    </>
  );
}
