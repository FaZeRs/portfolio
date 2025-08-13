import { useSuspenseQuery } from "@tanstack/react-query";
import {
  createFileRoute,
  ErrorComponent,
  notFound,
} from "@tanstack/react-router";
import { TRPCClientError } from "@trpc/client";
import CustomMDX from "~/components/mdx/mdx";
import { NotFound } from "~/components/not-found";
import { siteConfig } from "~/lib/config/site";
import { seo } from "~/lib/seo";
import { formatDate } from "~/lib/utils";
import { useTRPC } from "~/trpc/react";

export const Route = createFileRoute("/_defaultLayout/snippets/$snippetId")({
  loader: async ({ params: { snippetId }, context: { trpc, queryClient } }) => {
    try {
      const data = await queryClient.ensureQueryData(
        trpc.snippet.bySlug.queryOptions({ slug: snippetId }),
      );
      return {
        title: data?.title,
        description: data?.description,
      };
    } catch (error) {
      if (
        error instanceof TRPCClientError &&
        error.data?.code === "NOT_FOUND"
      ) {
        throw notFound();
      }
      throw error;
    }
  },
  head: ({ loaderData }) => ({
    meta: seo({
      title: `${loaderData?.title} | ${siteConfig.title}`,
      description: loaderData?.description,
      keywords: siteConfig.keywords,
    }),
  }),
  component: RouteComponent,
  errorComponent: ({ error }) => <ErrorComponent error={error} />,
  notFoundComponent: () => {
    return <NotFound>Snippet not found</NotFound>;
  },
});

function RouteComponent() {
  const { snippetId } = Route.useParams();
  const trpc = useTRPC();
  const snippet = useSuspenseQuery(
    trpc.snippet.bySlug.queryOptions({ slug: snippetId }),
  );

  return (
    <article className="relative lg:gap-10 xl:grid xl:max-w-6xl">
      <div className="w-full min-w-0">
        <div className="mb-6">
          <h1 className="mt-2 inline-block font-heading text-4xl leading-tight lg:text-5xl">
            {snippet.data?.title}
          </h1>

          <div className="mt-4 flex space-x-2 text-lg text-muted-foreground">
            {snippet.data?.updatedAt && (
              <time dateTime={snippet.data.updatedAt.toISOString()}>
                {formatDate(snippet.data.updatedAt)}
              </time>
            )}
          </div>
        </div>

        {snippet.data?.code && <CustomMDX source={snippet.data?.code} />}
      </div>
    </article>
  );
}
