import { ServiceBaseSchema } from "@acme/db/schema";
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
import { ServicesForm } from "~/components/services/form";
import { queryKeys } from "~/lib/query-keys";
import { $getServiceById, $updateService } from "~/lib/server/service";

export const Route = createFileRoute("/(dashboard)/services/$serviceId/edit")({
  component: ServicesEditPage,
  loader: async ({ params: { serviceId }, context: { queryClient } }) => {
    const data = await queryClient.ensureQueryData({
      queryKey: queryKeys.service.byId(serviceId),
      queryFn: () => $getServiceById({ data: { id: serviceId } }),
    });

    return { title: data?.title };
  },
  head: ({ loaderData }) => ({
    meta: [{ title: `Edit Service: ${loaderData?.title} | Dashboard` }],
  }),
  errorComponent: ({ error }) => <ErrorComponent error={error} />,
  notFoundComponent: () => <NotFound>Service not found</NotFound>,
});

function ServicesEditPage() {
  const { serviceId } = Route.useParams();

  const service = useSuspenseQuery({
    queryKey: queryKeys.service.byId(serviceId),
    queryFn: () => $getServiceById({ data: { id: serviceId } }),
  });

  const router = useRouter();
  const queryClient = useQueryClient();

  const updateServiceMutation = useMutation({
    mutationFn: (data: z.infer<typeof ServiceBaseSchema> & { id: string }) =>
      $updateService({ data }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.service.all });
      toast.success("Service updated successfully");
      form.reset();
      router.navigate({ to: "/services" });
    },
    onError: (error) => {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";

      toast.error(
        `Failed to create service: ${
          errorMessage.includes("validation")
            ? "Please check your form inputs"
            : "Server error. Please try again later."
        }`
      );
    },
  });

  const handleFormSubmit = (data: z.infer<typeof ServiceBaseSchema>) => {
    updateServiceMutation.mutate({
      ...data,
      id: service.data?.id ?? "",
    });
  };

  const form = useAppForm({
    defaultValues: {
      title: service.data?.title ?? "",
      slug: service.data?.slug ?? "",
      description: service.data?.description ?? "",
      content: service.data?.content ?? "",
      thumbnail: "",
      isDraft: service.data?.isDraft ?? false,
      stacks: service.data?.stacks ?? [],
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
          <h2 className="font-bold text-2xl tracking-tight">Edit Service</h2>
          <p className="text-muted-foreground">Edit a service here.</p>
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
            <ServicesForm form={form} service={service.data} />
          </form>
        </form.AppForm>
      </div>
    </>
  );
}
