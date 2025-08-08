import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import {
  ErrorComponent,
  createFileRoute,
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
import { formatDate } from "~/lib/utils";
import { useTRPC } from "~/trpc/react";

export const Route = createFileRoute("/_defaultLayout/blog/$articleId")({
  loader: async ({ params: { articleId }, context: { trpc, queryClient } }) => {
    try {
      const data = await queryClient.ensureQueryData(
        trpc.blog.bySlug.queryOptions({ slug: articleId }),
      );
      await queryClient.prefetchQuery(
        trpc.comment.all.queryOptions({
          articleId: data?.id,
        }),
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
    trpc.blog.bySlug.queryOptions({ slug: articleId }),
  );

  const queryClient = useQueryClient();
  const viewMutation = useMutation({
    ...trpc.blog.view.mutationOptions(),
    onSuccess: async () => {
      await queryClient.invalidateQueries(trpc.blog.pathFilter());
    },
    onError: (error) => {
      console.error("Error viewing article:", error);
    },
  });

  const hasViewedRef = useRef(false);
  // biome-ignore lint/correctness/useExhaustiveDependencies: view once per mount
  useEffect(() => {
    if (!articleId) return;
    if (hasViewedRef.current) return;
    hasViewedRef.current = true;

    // Session guard to avoid duplicate increments across navigation's in the same tab
    const sessionKey = `viewed:${articleId}`;
    if (sessionStorage.getItem(sessionKey)) return;
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
            <div className="flex items-start justify-between gap-4">
              <h1 className="mt-2 inline-block font-heading text-4xl leading-tight lg:text-5xl">
                {article.title}
              </h1>
              <div className="mt-2 flex-shrink-0">
                <LikeButton article={article} />
              </div>
            </div>

            <div className="mt-4 flex justify-between text-md text-muted-foreground">
              {article.createdAt && (
                <time dateTime={article.createdAt.toISOString()}>
                  {formatDate(article.createdAt)}
                </time>
              )}

              <ArticleMetrics article={article} />
            </div>
            {article.author ? (
              <div className="mt-4 flex items-center space-x-4">
                {article.author.image && (
                  <img
                    src={article.author.image}
                    alt={article.author.name}
                    width={42}
                    height={42}
                    className="rounded-full bg-white"
                  />
                )}
                <div className="flex-1 text-left leading-tight">
                  <p className="font-medium">{article.author.name}</p>
                </div>
              </div>
            ) : null}

            {article.imageUrl && (
              <img
                src={article.imageUrl}
                alt={article.title}
                width={832}
                height={405}
                className="my-8 rounded-md border bg-muted transition-colors"
              />
            )}
          </div>

          {article.content && <CustomMDX source={article.content} />}

          <hr className="my-4" />

          {/* Post tag */}
          <div className="flex flex-row items-center justify-between">
            {article.tags && (
              <ul className="m-0 list-none space-x-2 p-0 text-muted-foreground text-sm">
                {article.tags.map((tag: string) => (
                  <li className="inline-block p-0" key={tag}>
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
