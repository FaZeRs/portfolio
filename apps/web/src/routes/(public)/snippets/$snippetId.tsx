import { siteConfig } from "@acme/config";
import { CustomMDX } from "@acme/mdx";
import { Spinner } from "@acme/ui/spinner";
import { formatDate } from "@acme/utils";
import { useSuspenseQuery } from "@tanstack/react-query";
import {
  ClientOnly,
  createFileRoute,
  ErrorComponent,
  notFound,
} from "@tanstack/react-router";
import { TRPCClientError } from "@trpc/client";
import { Suspense } from "react";
import { NotFound } from "~/components/not-found";
import { seo } from "~/lib/seo";
import { useTRPC } from "~/lib/trpc";
import { getBaseUrl } from "~/lib/utils";

export const Route = createFileRoute("/(public)/snippets/$snippetId")({
  loader: async ({ params: { snippetId }, context: { trpc, queryClient } }) => {
    try {
      const data = await queryClient.ensureQueryData(
        trpc.snippet.bySlug.queryOptions({ slug: snippetId })
      );
      return {
        title: data?.title,
        description: data?.description,
        slug: data?.slug,
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
  const trpc = useTRPC();
  const snippet = useSuspenseQuery(
    trpc.snippet.bySlug.queryOptions({ slug: snippetId })
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

        <ClientOnly>
          <Suspense fallback={<Spinner className="size-6" />}>
            <article className="prose prose-slate dark:prose-invert !max-w-none">
              <CustomMDX source={snippet.data?.code ?? ""} />
            </article>
          </Suspense>
        </ClientOnly>
      </div>
    </article>
  );
}
