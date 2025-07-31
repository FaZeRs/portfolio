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
import { useEffect, useState } from "react";
import ArticleMetrics from "~/components/blog/article-metrics";
import LikeButton from "~/components/blog/like-button";
import TableOfContents from "~/components/blog/toc";
import BreadcrumbNavigation from "~/components/breadcrumb-navigation";
import CustomMDX from "~/components/mdx/mdx";
import { NotFound } from "~/components/not-found";
import SocialShare from "~/components/social-share";
import { siteConfig } from "~/lib/config/site";
import { seo } from "~/lib/seo";
import { formatDate, getTOC } from "~/lib/utils";
import { useTRPC } from "~/trpc/react";
import { TOC } from "~/types";

export const Route = createFileRoute("/_defaultLayout/blog/$articleId")({
  loader: async ({ params: { articleId }, context: { trpc, queryClient } }) => {
    try {
      const data = await queryClient.ensureQueryData(
        trpc.blog.bySlug.queryOptions({ slug: articleId }),
      );
      return {
        title: data?.title,
        description: data?.description,
        image: data?.imageUrl,
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
  const article = useSuspenseQuery(
    trpc.blog.bySlug.queryOptions({ slug: articleId }),
  );
  const [toc, setToc] = useState<TOC[]>([]);

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

  useEffect(() => {
    if (article.data?.content) {
      getTOC(article.data.content).then(setToc);
    } else {
      setToc([]);
    }
  }, [article.data?.content]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: we want to view the article on mount
  useEffect(() => {
    // only view the article if it's not already being viewed
    if (articleId && !viewMutation.isPending) {
      viewMutation.mutate({ slug: articleId });
    }
  }, [articleId]);

  if (!article.data) {
    return null;
  }

  return (
    <article className="relative lg:gap-10 xl:grid xl:max-w-6xl xl:grid-cols-[1fr_250px]">
      <div className="w-full min-w-0">
        <BreadcrumbNavigation pageTitle={article.data?.title} />

        <div>
          <div className="flex items-start justify-between gap-4">
            <h1 className="mt-2 inline-block font-heading text-4xl leading-tight lg:text-5xl">
              {article.data?.title}
            </h1>
            <div className="mt-2 flex-shrink-0">
              <LikeButton article={article.data} />
            </div>
          </div>

          <div className="mt-4 flex justify-between text-md text-muted-foreground">
            {article.data?.createdAt && (
              <time dateTime={article.data?.createdAt.toISOString()}>
                {formatDate(article.data?.createdAt)}
              </time>
            )}

            <ArticleMetrics article={article.data} />
          </div>

          {/* {authors?.length ? (
            <div className="mt-4 flex space-x-4">
              {authors.map((author) =>
                author ? (
                  <Link
                    key={author.name}
                    href={`https://twitter.com/${author.username}`}
                    className="flex items-center space-x-2 text-sm"
                  >
                    <Image
                      src={author.avatar}
                      alt={author.name}
                      width={42}
                      height={42}
                      className="rounded-full bg-white"
                    />
                    <div className="flex-1 text-left leading-tight">
                      <p className="font-medium">{author.name}</p>
                      <p className="text-[12px] text-muted-foreground">
                        @{author.username}
                      </p>
                    </div>
                  </Link>
                ) : null,
              )}
            </div>
          ) : null} */}

          {article.data?.imageUrl && (
            <img
              src={article.data.imageUrl}
              alt={article.data.title}
              width={832}
              height={405}
              className="my-8 rounded-md border bg-muted transition-colors"
            />
          )}
        </div>

        {article.data?.content && <CustomMDX source={article.data.content} />}

        <hr className="my-4" />

        {/* Post tag */}
        <div className="flex flex-row items-center justify-between">
          {article.data?.tags && (
            <ul className="m-0 list-none space-x-2 p-0 text-muted-foreground text-sm">
              {article.data.tags.map((tag: string) => (
                <li className="inline-block p-0" key={tag}>
                  {tag}
                </li>
              ))}
            </ul>
          )}
          <SocialShare
            text={`${article.data.title} via ${siteConfig.author.handle}`}
            url={`${siteConfig.url}/blog/${articleId}`}
          />
        </div>

        {/* <PostComment slug={slug} /> */}
      </div>

      {/* Table of contents */}
      {toc && (
        <div className="hidden text-sm xl:block">
          <div className="-mt-10 sticky top-16 max-h-[calc(var(--vh)-4rem)] pt-10">
            <TableOfContents toc={toc} />
          </div>
        </div>
      )}
    </article>
  );
}
