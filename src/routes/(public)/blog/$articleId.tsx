import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import {
  createFileRoute,
  ErrorComponent,
  notFound,
} from "@tanstack/react-router";
import { TRPCClientError } from "@trpc/client";
import { useEffect, useRef } from "react";
import SignInModal from "~/components/auth/sign-in-modal";
import ArticleComment from "~/components/blog/article-comment";
import ArticleMetrics from "~/components/blog/article-metrics";
import LikeButton from "~/components/blog/like-button";
import TableOfContents from "~/components/blog/toc";
import BreadcrumbNavigation from "~/components/breadcrumb-navigation";
import CustomMDX from "~/components/mdx/mdx";
import { NotFound } from "~/components/not-found";
import SocialShare from "~/components/social-share";
import { siteConfig } from "~/lib/config/site";
import { seo } from "~/lib/seo";
import { useTRPC } from "~/trpc/react";

export const Route = createFileRoute("/(public)/blog/$articleId")({
  loader: async ({ params: { articleId }, context: { trpc, queryClient } }) => {
    try {
      const data = await queryClient.ensureQueryData(
        trpc.blog.bySlug.queryOptions({ slug: articleId })
      );
      await queryClient.prefetchQuery(
        trpc.comment.all.queryOptions({
          articleId: data?.id,
        })
      );
      return {
        title: data?.title,
        description: data?.description,
        image: data?.imageUrl,
        author: data?.author?.name,
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
      image: loaderData?.image,
      author: loaderData?.author,
      type: "article",
    }),
  }),
  component: RouteComponent,
  errorComponent: ({ error }) => <ErrorComponent error={error} />,
  notFoundComponent: () => {
    return <NotFound>Article not found</NotFound>;
  },
});

function RouteComponent() {
  const { articleId } = Route.useParams();
  const trpc = useTRPC();
  const { data: article } = useSuspenseQuery(
    trpc.blog.bySlug.queryOptions({ slug: articleId })
  );

  const queryClient = useQueryClient();
  const viewMutation = useMutation({
    ...trpc.blog.view.mutationOptions(),
    onSuccess: async () => {
      await queryClient.invalidateQueries(trpc.blog.pathFilter());
    },
    onError: (error) => {
      // biome-ignore lint/suspicious/noConsole: log error
      console.error(error);
    },
  });

  const hasViewedRef = useRef(false);
  // biome-ignore lint/correctness/useExhaustiveDependencies: view once per mount
  useEffect(() => {
    if (!articleId) {
      return;
    }
    if (hasViewedRef.current) {
      return;
    }
    hasViewedRef.current = true;

    // Session guard to avoid duplicate increments across navigation's in the same tab
    const sessionKey = `viewed:${articleId}`;
    if (sessionStorage.getItem(sessionKey)) {
      return;
    }
    sessionStorage.setItem(sessionKey, "1");

    viewMutation.mutate({ slug: articleId });
  }, [articleId]);

  if (!article) {
    return null;
  }

  return (
    <>
      <article className="relative lg:gap-10 xl:grid xl:max-w-6xl xl:grid-cols-[1fr_250px]">
        <div className="w-full min-w-0">
          <BreadcrumbNavigation pageTitle={article.title} />

          <div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
              <h1 className="mt-2 inline-block font-heading text-3xl leading-tight sm:text-4xl lg:text-5xl">
                {article.title}
              </h1>
              <div className="mt-1 sm:mt-2 sm:flex-shrink-0">
                <LikeButton article={article} />
              </div>
            </div>

            <ArticleMetrics article={article} />

            {article.author ? (
              <div className="mt-4 flex items-center gap-3 sm:gap-4">
                {article.author.image && (
                  <img
                    alt={article.author.name}
                    className="rounded-full bg-white"
                    height={40}
                    src={article.author.image}
                    width={40}
                  />
                )}
                <div className="flex-1 text-left leading-tight">
                  <p className="font-medium text-sm sm:text-base">
                    {article.author.name}
                  </p>
                </div>
              </div>
            ) : null}

            {article.imageUrl && (
              <img
                alt={article.title}
                className="my-6 w-full rounded-md border bg-muted transition-colors sm:my-8"
                height={405}
                src={article.imageUrl}
                width={832}
              />
            )}
          </div>

          {article.content && <CustomMDX source={article.content} />}

          <hr className="my-4" />

          {/* Post tag */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            {article.tags && (
              <ul className="m-0 list-none p-0 text-muted-foreground text-sm">
                {article.tags.map((tag: string) => (
                  <li className="mr-2 inline-block p-0" key={tag}>
                    {tag}
                  </li>
                ))}
              </ul>
            )}
            <SocialShare
              text={`${article.title} via ${siteConfig.author.handle}`}
              url={`${siteConfig.url}/blog/${articleId}`}
            />
          </div>

          <ArticleComment articleId={article.id} articleSlug={article.slug} />
        </div>

        {/* Table of contents */}
        {article.toc && (
          <div className="hidden text-sm xl:block">
            <div className="-mt-10 sticky top-16 max-h-[calc(var(--vh)-4rem)] pt-10">
              <TableOfContents toc={article.toc} />
            </div>
          </div>
        )}
      </article>
      <SignInModal />
    </>
  );
}
