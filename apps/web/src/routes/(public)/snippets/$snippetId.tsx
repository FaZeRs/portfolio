import { siteConfig } from "@acme/config";
import { CustomMDX } from "@acme/mdx";
import { NotFound } from "@acme/ui/not-found";
import { Spinner } from "@acme/ui/spinner";
import { formatDate } from "@acme/utils";
import { useSuspenseQuery } from "@tanstack/react-query";
import {
  createFileRoute,
  ErrorComponent,
  notFound,
} from "@tanstack/react-router";
import { Suspense } from "react";
import { queryKeys } from "~/lib/query-keys";
import { seo } from "~/lib/seo";
import { $getSnippetBySlug } from "~/lib/server";
import { getBaseUrl } from "~/lib/utils";

export const Route = createFileRoute("/(public)/snippets/$snippetId")({
  loader: async ({ params: { snippetId }, context: { queryClient } }) => {
    try {
      const data = await queryClient.ensureQueryData({
        queryKey: queryKeys.snippet.detail(snippetId),
        queryFn: () => $getSnippetBySlug({ data: { slug: snippetId } }),
      });
      return {
        title: data?.title,
        description: data?.description,
        slug: data?.slug,
      };
    } catch (error) {
      if (
        error instanceof Error &&
        (error.message === "Snippet not found" ||
          error.message === "Snippet is not public")
      ) {
        throw notFound();
      }
      throw error;
    }
  },
  head: ({ loaderData }) => {
    const seoData = seo({
      title: `${loaderData?.title} | ${siteConfig.title}`,
      description: loaderData?.description,
      keywords: siteConfig.keywords,
      url: `${getBaseUrl()}/snippets/${loaderData?.slug}`,
      canonical: `${getBaseUrl()}/snippets/${loaderData?.slug}`,
    });
    return {
      meta: seoData.meta,
      links: seoData.links,
    };
  },
  component: RouteComponent,
  errorComponent: ({ error }) => <ErrorComponent error={error} />,
  notFoundComponent: () => <NotFound>Snippet not found</NotFound>,
});

function RouteComponent() {
  const { snippetId } = Route.useParams();
  const snippet = useSuspenseQuery({
    queryKey: queryKeys.snippet.detail(snippetId),
    queryFn: () => $getSnippetBySlug({ data: { slug: snippetId } }),
  });

  return (
    <article className="relative lg:gap-10 xl:grid xl:max-w-6xl 2xl:max-w-7xl">
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

        <Suspense fallback={<Spinner className="size-6" />}>
          <article className="prose prose-slate dark:prose-invert !max-w-none">
            <CustomMDX source={snippet.data?.code ?? ""} />
          </article>
        </Suspense>
      </div>
    </article>
  );
}
