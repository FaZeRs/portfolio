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
import { ArticleForm } from "~/components/blog/form";
import { NotFound } from "~/components/not-found";
import { useAppForm } from "~/components/ui/form";
import { ArticleBaseSchema } from "~/lib/server/schema";
import { useTRPC } from "~/trpc/react";

export const Route = createFileRoute(
  "/_dashboardLayout/dashboard/blog/$articleId/edit",
)({
  component: ArticlesEditPage,
  loader: async ({ params: { articleId }, context: { trpc, queryClient } }) => {
    const data = await queryClient.ensureQueryData(
      trpc.blog.byId.queryOptions({ id: articleId }),
    );

    return { title: data?.title };
  },
  head: ({ loaderData }) => ({
    meta: [{ title: `Edit Article: ${loaderData?.title} | Dashboard` }],
  }),
  errorComponent: ({ error }) => <ErrorComponent error={error} />,
  notFoundComponent: () => {
    return <NotFound>Project not found</NotFound>;
  },
});

function ArticlesEditPage() {
  const { articleId } = Route.useParams();
  const trpc = useTRPC();

  const article = useSuspenseQuery(
    trpc.blog.byId.queryOptions({ id: articleId }),
  );

  const router = useRouter();
  const queryClient = useQueryClient();

  const updateArticleMutation = useMutation({
    ...trpc.blog.update.mutationOptions(),
    onSuccess: async () => {
      await queryClient.invalidateQueries(trpc.blog.pathFilter());
      toast.success("Article updated successfully");
      form.reset();
      router.navigate({ to: "/dashboard/blog" });
    },
    onError: (error) => {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      console.error("Error creating article:", errorMessage);

      toast.error(
        `Failed to create article: ${
          errorMessage.includes("validation")
            ? "Please check your form inputs"
            : "Server error. Please try again later."
        }`,
      );
    },
  });

  const handleFormSubmit = (data: z.infer<typeof ArticleBaseSchema>) => {
    updateArticleMutation.mutate({
      ...data,
      id: article.data?.id ?? "",
    });
  };

  const form = useAppForm({
    defaultValues: {
      title: article.data?.title ?? "",
      slug: article.data?.slug ?? "",
      description: article.data?.description ?? "",
      content: article.data?.content ?? "",
      thumbnail: "",
      isDraft: article.data?.isDraft ?? false,
      tags: article.data?.tags ?? [],
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
          <h2 className="font-bold text-2xl tracking-tight">Edit Article</h2>
          <p className="text-muted-foreground">Edit an article here.</p>
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
            <ArticleForm form={form} article={article.data} />
          </form>
        </form.AppForm>
      </div>
    </>
  );
}
