import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { ProjectsForm } from "~/lib/components/projects/form";
import { useTRPC } from "~/trpc/react";

export const Route = createFileRoute(
  "/_dashboardLayout/dashboard/projects/$projectId/edit",
)({
  component: ProjectsEditPage,
  loader: ({ context }) => {
    return { user: context.user };
  },
});

function ProjectsEditPage() {
  const trpc = useTRPC();
  const projectQuery = useQuery(trpc.project.byId.queryOptions({ id }));

  // const queryClient = useQueryClient();

  // const form = useForm({
  //   schema: UpdateProjectSchema,
  //   defaultValues: {
  //     title: project.title,
  //     slug: project.slug,
  //     description: project.description ?? "",
  //     content: project.content ?? "",
  //     image: undefined,
  //     githubUrl: project.githubUrl ?? "",
  //     demoUrl: project.demoUrl ?? "",
  //   },
  // });

  // const updateProject = useMutation(
  // trpc.project.update.mutationOptions({
  //   onSuccess: async () => {
  //     await queryClient.invalidateQueries(trpc.project.pathFilter());
  //   },
  //   onError: (err) => {
  //     toast.error(
  //       err.data?.code === "UNAUTHORIZED"
  //         ? "You must be logged in to edit this project"
  //         : "Failed to edit project",
  //     );
  //   },
  // }),
  // );

  if (projectQuery.isLoading) {
    return <div>Loading...</div>;
  }

  if (projectQuery.isError) {
    return <div>Error: {projectQuery.error.message}</div>;
  }

  if (!projectQuery.data) {
    return <div>Project not found</div>;
  }

  return <ProjectsForm />;
}
