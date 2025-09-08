import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { toast } from "sonner";
import { z } from "zod/v4";
import { ExperiencesForm } from "~/components/experiences/form";
import { useAppForm } from "~/components/ui/form";
import { ExperienceBaseSchema, ExperienceType } from "~/lib/server/schema";
import { useTRPC } from "~/trpc/react";

export const Route = createFileRoute("/dashboard/experiences/create")({
  component: ExperiencesCreatePage,
  head: () => ({
    meta: [{ title: "Create Experience | Dashboard" }],
  }),
});

function ExperiencesCreatePage() {
  const router = useRouter();
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const createExperienceMutation = useMutation({
    ...trpc.experience.create.mutationOptions(),
    onSuccess: async () => {
      await queryClient.invalidateQueries(trpc.experience.pathFilter());
      toast.success("Experience created successfully");
      form.reset();
      router.navigate({ to: "/dashboard/experiences" });
    },
    onError: (_error) => {
      toast.error("Failed to create experience");
    },
  });

  const handleFormSubmit = (data: z.infer<typeof ExperienceBaseSchema>) => {
    createExperienceMutation.mutate(data);
  };

  const form = useAppForm({
    defaultValues: {
      title: "",
      institution: "",
      description: "",
      thumbnail: "",
      startDate: "",
      endDate: "",
      url: "",
      type: ExperienceType.WORK,
      isDraft: false,
      isOnGoing: false,
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
          <h2 className="font-bold text-2xl tracking-tight">
            Create Experience
          </h2>
          <p className="text-muted-foreground">Create a new experience here.</p>
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
            <ExperiencesForm experience={undefined} form={form} />
          </form>
        </form.AppForm>
      </div>
    </>
  );
}
