import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { toast } from "sonner";
import { z } from "zod";
import { ProjectsForm } from "~/components/projects/form";
import { useAppForm } from "~/components/ui/form";
import { ProjectBaseSchema } from "~/lib/server/schema";
import { useTRPC } from "~/trpc/react";

export const Route = createFileRoute(
  "/_dashboardLayout/dashboard/projects/create",
)({
  component: ProjectsCreatePage,
  head: () => ({
    meta: [{ title: "Create Project | Dashboard" }],
  }),
});

function ProjectsCreatePage() {
  const router = useRouter();
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const createProjectMutation = useMutation({
    ...trpc.project.create.mutationOptions(),
    onSuccess: async () => {
      await queryClient.invalidateQueries(trpc.project.pathFilter());
      toast.success("Project created successfully");
      form.reset();
      router.navigate({ to: "/dashboard/projects" });
    },
    onError: (error) => {
      console.error("Error creating project:", error);
      toast.error("Failed to create project");
    },
  });

  const handleFormSubmit = (data: z.infer<typeof ProjectBaseSchema>) => {
    createProjectMutation.mutate(data);
  };

  const form = useAppForm({
    defaultValues: {
      title: "",
      slug: "",
      description: "",
      content: "",
      githubUrl: "",
      demoUrl: "",
      thumbnail: "",
      isFeatured: false,
      isDraft: false,
      stacks: [] as string[],
    },
    validators: {
      onChange: ProjectBaseSchema,
    },
    onSubmit: ({ value }) => {
      handleFormSubmit(value);
    },
  });

  return (
    <>
      <div className="mb-2 flex flex-wrap items-center justify-between space-y-2">
        <div>
          <h2 className="font-bold text-2xl tracking-tight">Create Project</h2>
          <p className="text-muted-foreground">Create a new project here.</p>
        </div>
      </div>
      <div className="py-4">
        <form.AppForm>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}
            className="space-y-8"
          >
            <ProjectsForm form={form} project={undefined} />
          </form>
        </form.AppForm>
      </div>
    </>
  );
}
