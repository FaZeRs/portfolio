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
import { SnippetsForm } from "~/components/snippets/form";
import { useAppForm } from "~/components/ui/form";
import { SnippetBaseSchema } from "~/lib/db/schema";
import { useTRPC } from "~/trpc/react";

export const Route = createFileRoute("/dashboard/snippets/$snippetId/edit")({
  component: SnippetsEditPage,
  loader: async ({ params: { snippetId }, context: { trpc, queryClient } }) => {
    const data = await queryClient.ensureQueryData(
      trpc.snippet.byId.queryOptions({ id: snippetId })
    );

    return { title: data?.title };
  },
  head: ({ loaderData }) => ({
    meta: [{ title: `Edit Snippet: ${loaderData?.title} | Dashboard` }],
  }),
  errorComponent: ({ error }) => <ErrorComponent error={error} />,
  notFoundComponent: () => <NotFound>Snippet not found</NotFound>,
});

function SnippetsEditPage() {
  const { snippetId } = Route.useParams();
  const trpc = useTRPC();

  const snippet = useSuspenseQuery(
    trpc.snippet.byId.queryOptions({ id: snippetId })
  );

  const router = useRouter();
  const queryClient = useQueryClient();

  const updateSnippetMutation = useMutation({
    ...trpc.snippet.update.mutationOptions(),
    onSuccess: async () => {
      await queryClient.invalidateQueries(trpc.snippet.pathFilter());
      toast.success("Snippet updated successfully");
      form.reset();
      router.navigate({ to: "/dashboard/snippets" });
    },
    onError: (error) => {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";

      toast.error(
        `Failed to update snippet: ${
          errorMessage.includes("validation")
            ? "Please check your form inputs"
            : "Server error. Please try again later."
        }`
      );
    },
  });

  const handleFormSubmit = (data: z.infer<typeof SnippetBaseSchema>) => {
    updateSnippetMutation.mutate({
      ...data,
      id: snippet.data?.id ?? "",
    });
  };

  const form = useAppForm({
    defaultValues: {
      title: snippet.data?.title ?? "",
      slug: snippet.data?.slug ?? "",
      description: snippet.data?.description ?? "",
      category: snippet.data?.category ?? "",
      code: snippet.data?.code ?? "",
      isDraft: snippet.data?.isDraft ?? false,
    },
    validators: {
      onChange: SnippetBaseSchema,
    },
    onSubmit: ({ value }) => {
      handleFormSubmit(value);
    },
  });

  return (
    <>
      <div className="mb-2 flex flex-wrap items-center justify-between space-y-2">
        <div>
          <h2 className="font-bold text-2xl tracking-tight">Edit Snippet</h2>
          <p className="text-muted-foreground">Edit a snippet here.</p>
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
            <SnippetsForm form={form} />
          </form>
        </form.AppForm>
      </div>
    </>
  );
}
