import { createFileRoute } from "@tanstack/react-router";
import { ProjectsForm } from "~/lib/components/projects/form";

export const Route = createFileRoute("/_dashboardLayout/dashboard/projects/create")({
  component: ProjectsCreatePage,
  loader: ({ context }) => {
    return { user: context.user };
  },
});

function ProjectsCreatePage() {
  // const trpc = useTRPC();
  // const queryClient = useQueryClient();

  // const form = useForm({
  //   schema: CreateProjectSchema,
  //   defaultValues: {
  //     title: "",
  //     slug: "",
  //     description: "",
  //     content: "",
  //     image: undefined,
  //     githubUrl: "",
  //     demoUrl: "",
  //   },
  // });

  // const createProject = useMutation(
  //   trpc.project.create.mutationOptions({
  //     onSuccess: async (data) => {
  //       console.log("onSuccess", data);
  //       form.reset();
  //       await queryClient.invalidateQueries(trpc.project.pathFilter());
  //       toast.success("Project created successfully");
  //     },
  //     onError: (err) => {
  //       if (err instanceof TRPCClientError) {
  //         toast.error(
  //           err.data?.code === "UNAUTHORIZED"
  //             ? "You must be logged in to create a project"
  //             : "Failed to create project",
  //         );
  //       } else {
  //         toast.error("An unexpected error occurred");
  //       }
  //     },
  //   }),
  // );

  // const onSubmit = async (data: z.infer<typeof CreateProjectSchema>) => {
  //   createProject.mutate(data);
  // };

  return <ProjectsForm />;
}
