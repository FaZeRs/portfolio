import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, ErrorComponent, useRouter } from "@tanstack/react-router";
import { toast } from "sonner";
import { z } from "zod";
import { NotFound } from "~/lib/components/not-found";
import { ProjectsForm } from "~/lib/components/projects/form";
import { useAppForm } from "~/lib/components/ui/form";
import { ProjectBaseSchema } from "~/lib/server/schema";
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
    meta: [{ title: loaderData.title }],
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

  const updateProjectMutation = useMutation({
    ...trpc.project.update.mutationOptions(),
    onSuccess: async () => {
      await queryClient.invalidateQueries(trpc.project.pathFilter());
      toast.success("Project updated successfully");
      router.navigate({ to: "/dashboard/projects" });
    },
    onError: (error) => {
      console.error("Error updating project:", error);
      toast.error("Failed to update project");
    },
  });

  const handleFormSubmit = (data: z.infer<typeof ProjectBaseSchema>) => {
    updateProjectMutation.mutate({
      ...data,
      id: project.data?.id ?? "",
    });
  };

  const form = useAppForm({
    defaultValues: {
      title: project.data?.title ?? "",
      slug: project.data?.slug ?? "",
      description: project.data?.description ?? "",
      content: project.data?.content ?? "",
      githubUrl: project.data?.githubUrl ?? "",
      demoUrl: project.data?.demoUrl ?? "",
      thumbnail: "",
      isFeatured: project.data?.isFeatured ?? false,
      isDraft: project.data?.isDraft ?? false,
    },
    validators: {
      onChange: ProjectBaseSchema,
    },
    onSubmit: ({ formApi, value }) => {
      handleFormSubmit(value);
      formApi.reset();
    },
  });

  return (
    <>
      <div className="mb-2 flex flex-wrap items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Edit Project</h2>
          <p className="text-muted-foreground">Edit a project here.</p>
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
            <ProjectsForm form={form} project={project.data} />
          </form>
        </form.AppForm>
      </div>
    </>
  );
}
