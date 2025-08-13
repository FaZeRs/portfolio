import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import {
  createFileRoute,
  ErrorComponent,
  useRouter,
} from "@tanstack/react-router";
import { toast } from "sonner";
import { z } from "zod/v4";
import { NotFound } from "~/components/not-found";
import { ProjectsForm } from "~/components/projects/form";
import { useAppForm } from "~/components/ui/form";
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
    meta: [{ title: `Edit Project: ${loaderData?.title} | Dashboard` }],
  }),
  errorComponent: ({ error }) => <ErrorComponent error={error} />,
  notFoundComponent: () => {
    return <NotFound>Project not found</NotFound>;
  },
});

function ProjectsEditPage() {
  const { projectId } = Route.useParams();
  const trpc = useTRPC();

  const project = useSuspenseQuery(
    trpc.project.byId.queryOptions({ id: projectId }),
  );

  const router = useRouter();
  const queryClient = useQueryClient();

  const updateProjectMutation = useMutation({
    ...trpc.project.update.mutationOptions(),
    onSuccess: async () => {
      await queryClient.invalidateQueries(trpc.project.pathFilter());
      toast.success("Project updated successfully");
      form.reset();
      router.navigate({ to: "/dashboard/projects" });
    },
    onError: (error) => {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      console.error("Error creating project:", errorMessage);

      toast.error(
        `Failed to create project: ${
          errorMessage.includes("validation")
            ? "Please check your form inputs"
            : "Server error. Please try again later."
        }`,
      );
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
      stacks: project.data?.stacks ?? [],
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
          <h2 className="font-bold text-2xl tracking-tight">Edit Project</h2>
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
