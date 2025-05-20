import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import {
  ErrorComponent,
  createFileRoute,
  useRouter,
} from "@tanstack/react-router";
import { toast } from "sonner";
import { z } from "zod/v4";
import { ExperiencesForm } from "~/components/experiences/form";
import { NotFound } from "~/components/not-found";
import { useAppForm } from "~/components/ui/form";
import { ExperienceBaseSchema, ExperienceType } from "~/lib/server/schema";
import { useTRPC } from "~/trpc/react";

export const Route = createFileRoute(
  "/_dashboardLayout/dashboard/experiences/$experienceId/edit",
)({
  component: ExperiencesEditPage,
  loader: async ({
    params: { experienceId },
    context: { trpc, queryClient },
  }) => {
    const data = await queryClient.ensureQueryData(
      trpc.experience.byId.queryOptions({ id: experienceId }),
    );

    return { title: data?.title };
  },
  head: ({ loaderData }) => ({
    meta: [{ title: `Edit Experience: ${loaderData?.title} | Dashboard` }],
  }),
  errorComponent: ({ error }) => <ErrorComponent error={error} />,
  notFoundComponent: () => {
    return <NotFound>Project not found</NotFound>;
  },
});

function ExperiencesEditPage() {
  const { experienceId } = Route.useParams();
  const trpc = useTRPC();

  const experience = useSuspenseQuery(
    trpc.experience.byId.queryOptions({ id: experienceId }),
  );

  const router = useRouter();
  const queryClient = useQueryClient();

  const updateExperienceMutation = useMutation({
    ...trpc.experience.update.mutationOptions(),
    onSuccess: async () => {
      await queryClient.invalidateQueries(trpc.experience.pathFilter());
      toast.success("Experience updated successfully");
      form.reset();
      router.navigate({ to: "/dashboard/experiences" });
    },
    onError: (error) => {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      console.error("Error updating experience:", errorMessage);

      toast.error(
        `Failed to update experience: ${
          errorMessage.includes("validation")
            ? "Please check your form inputs"
            : "Server error. Please try again later."
        }`,
      );
    },
  });

  const handleFormSubmit = (data: z.infer<typeof ExperienceBaseSchema>) => {
    updateExperienceMutation.mutate({
      ...data,
      id: experience.data?.id ?? "",
    });
  };

  const form = useAppForm({
    defaultValues: {
      title: experience.data?.title ?? "",
      description: experience.data?.description ?? "",
      startDate: experience.data?.startDate ?? "",
      endDate: experience.data?.endDate ?? "",
      institution: experience.data?.institution ?? "",
      url: experience.data?.url ?? "",
      type: experience.data?.type ?? ExperienceType.WORK,
      thumbnail: "",
      isDraft: experience.data?.isDraft ?? false,
      isOnGoing: experience.data?.isOnGoing ?? false,
    },
    validators: {
      onChange: ExperienceBaseSchema,
    },
    onSubmit: ({ value }) => {
      handleFormSubmit(value);
    },
  });

  return (
    <>
      <div className="mb-2 flex flex-wrap items-center justify-between space-y-2">
        <div>
          <h2 className="font-bold text-2xl tracking-tight">Edit Experience</h2>
          <p className="text-muted-foreground">Edit an experience here.</p>
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
            <ExperiencesForm form={form} experience={experience.data} />
          </form>
        </form.AppForm>
      </div>
    </>
  );
}
