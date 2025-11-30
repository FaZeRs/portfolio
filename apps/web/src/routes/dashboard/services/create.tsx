import { ServiceBaseSchema } from "@acme/db/schema";
import { useAppForm } from "@acme/ui/form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { toast } from "sonner";
import { z } from "zod/v4";
import { ServicesForm } from "~/components/services/form";
import { useTRPC } from "~/lib/trpc";

export const Route = createFileRoute("/dashboard/services/create")({
  component: ServicesCreatePage,
  head: () => ({
    meta: [{ title: "Create Service | Dashboard" }],
  }),
});

function ServicesCreatePage() {
  const router = useRouter();
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const createServiceMutation = useMutation({
    ...trpc.service.create.mutationOptions(),
    onSuccess: async () => {
      await queryClient.invalidateQueries(trpc.service.pathFilter());
      toast.success("Service created successfully");
      form.reset();
      router.navigate({ to: "/dashboard/services" });
    },
    onError: (_error) => {
      toast.error("Failed to create service");
    },
  });

  const handleFormSubmit = (data: z.infer<typeof ServiceBaseSchema>) => {
    createServiceMutation.mutate(data);
  };

  const form = useAppForm({
    defaultValues: {
      title: "",
      slug: "",
      description: "",
      content: "",
      thumbnail: "",
      isDraft: false,
      stacks: [] as string[],
    },
    validators: {
      onChange: ServiceBaseSchema,
    },
    onSubmit: ({ value }) => {
      handleFormSubmit(value);
    },
  });

  return (
    <>
      <div className="mb-2 flex flex-wrap items-center justify-between space-y-2">
        <div>
          <h2 className="font-bold text-2xl tracking-tight">Create Service</h2>
          <p className="text-muted-foreground">Create a new service here.</p>
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
            <ServicesForm form={form} service={undefined} />
          </form>
        </form.AppForm>
      </div>
    </>
  );
}
