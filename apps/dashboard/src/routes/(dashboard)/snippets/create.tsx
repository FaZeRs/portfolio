import { SnippetBaseSchema } from "@acme/db/schema";
import { useAppForm } from "@acme/ui/form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { toast } from "sonner";
import { z } from "zod/v4";
import { SnippetsForm } from "~/components/snippets/form";
import { useTRPC } from "~/lib/trpc";

export const Route = createFileRoute("/(dashboard)/snippets/create")({
  component: SnippetsCreatePage,
  head: () => ({
    meta: [{ title: "Create Snippet | Dashboard" }],
  }),
});

function SnippetsCreatePage() {
  const router = useRouter();
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const createSnippetMutation = useMutation({
    ...trpc.snippet.create.mutationOptions(),
    onSuccess: async () => {
      await queryClient.invalidateQueries(trpc.snippet.pathFilter());
      toast.success("Snippet created successfully");
      form.reset();
      router.navigate({ to: "/snippets" });
    },
    onError: (_error) => {
      toast.error("Failed to create snippet");
    },
  });

  const handleFormSubmit = (data: z.infer<typeof SnippetBaseSchema>) => {
    createSnippetMutation.mutate(data);
  };

  const form = useAppForm({
    defaultValues: {
      title: "",
      slug: "",
      description: "",
      category: "",
      code: "",
      isDraft: false,
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
          <h2 className="font-bold text-2xl tracking-tight">Create Snippet</h2>
          <p className="text-muted-foreground">Create a new snippet here.</p>
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
