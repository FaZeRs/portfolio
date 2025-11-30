import { ArticleBaseSchema } from "@acme/db/schema";
import { useAppForm } from "@acme/ui/form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { toast } from "sonner";
import { z } from "zod/v4";
import { ArticleForm } from "~/components/blog/form";
import authClient from "~/lib/auth/client";
import { useTRPC } from "~/lib/trpc";

export const Route = createFileRoute("/dashboard/blog/create")({
  component: ArticlesCreatePage,
  head: () => ({
    meta: [{ title: "Create Article | Dashboard" }],
  }),
});

function ArticlesCreatePage() {
  const router = useRouter();
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const { data: session } = authClient.useSession();

  const createArticleMutation = useMutation({
    ...trpc.blog.create.mutationOptions(),
    onSuccess: async () => {
      await queryClient.invalidateQueries(trpc.blog.pathFilter());
      toast.success("Article created successfully");
      form.reset();
      router.navigate({ to: "/dashboard/blog" });
    },
    onError: (_error) => {
      toast.error("Failed to create article");
    },
  });

  const handleFormSubmit = (data: z.infer<typeof ArticleBaseSchema>) => {
    createArticleMutation.mutate({
      ...data,
      authorId: session?.user?.id ?? "",
    });
  };

  const form = useAppForm({
    defaultValues: {
      title: "",
      slug: "",
      description: "",
      content: "",
      thumbnail: "",
      isDraft: false,
      tags: [] as string[],
    },
    validators: {
      onChange: ArticleBaseSchema,
    },
    onSubmit: ({ value }) => {
      handleFormSubmit(value);
    },
  });

  return (
    <>
      <div className="mb-2 flex flex-wrap items-center justify-between space-y-2">
        <div>
          <h2 className="font-bold text-2xl tracking-tight">Create Article</h2>
          <p className="text-muted-foreground">Create a new article here.</p>
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
            <ArticleForm article={undefined} form={form} />
          </form>
        </form.AppForm>
      </div>
    </>
  );
}
