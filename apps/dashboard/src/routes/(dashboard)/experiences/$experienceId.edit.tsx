import { ExperienceBaseSchema, ExperienceType } from "@acme/db/schema";
import { useAppForm } from "@acme/ui/form";
import { NotFound } from "@acme/ui/not-found";
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
import { ExperiencesForm } from "~/components/experiences/form";
import { useTRPC } from "~/lib/trpc";

export const Route = createFileRoute(
  "/(dashboard)/experiences/$experienceId/edit"
)({
  component: ExperiencesEditPage,
  loader: async ({
    params: { experienceId },
    context: { trpc, queryClient },
  }) => {
    const data = await queryClient.ensureQueryData(
      trpc.experience.byId.queryOptions({ id: experienceId })
    );

    return { title: data?.title };
  },
  head: ({ loaderData }) => ({
    meta: [{ title: `Edit Experience: ${loaderData?.title} | Dashboard` }],
  }),
  errorComponent: ({ error }) => <ErrorComponent error={error} />,
  notFoundComponent: () => <NotFound>Project not found</NotFound>,
});

function ExperiencesEditPage() {
  const { experienceId } = Route.useParams();
  const trpc = useTRPC();

  const experience = useSuspenseQuery(
    trpc.experience.byId.queryOptions({ id: experienceId })
  );

  const router = useRouter();
  const queryClient = useQueryClient();

  const updateExperienceMutation = useMutation({
    ...trpc.experience.update.mutationOptions(),
    onSuccess: async () => {
      await queryClient.invalidateQueries(trpc.experience.pathFilter());
      toast.success("Experience updated successfully");
      form.reset();
      router.navigate({ to: "/experiences" });
    },
    onError: (error) => {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";

      toast.error(
        `Failed to update experience: ${
          errorMessage.includes("validation")
            ? "Please check your form inputs"
            : "Server error. Please try again later."
        }`
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
            className="space-y-8"
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}
          >
            <ExperiencesForm experience={experience.data} form={form} />
          </form>
        </form.AppForm>
      </div>
    </>
  );
}
