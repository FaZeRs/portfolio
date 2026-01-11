import { siteConfig } from "@acme/config";
import { CustomMDX } from "@acme/mdx";
import { LazyImage } from "@acme/ui/lazy-image";
import { NotFound } from "@acme/ui/not-found";
import { Spinner } from "@acme/ui/spinner";
import { calculateReadingTime, formatDate } from "@acme/utils";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import {
  ClientOnly,
  createFileRoute,
  ErrorComponent,
  notFound,
} from "@tanstack/react-router";
import { TRPCClientError } from "@trpc/client";
import { motion } from "framer-motion";
import { Calendar, Clock, Eye, Heart, MessageCircle, Tag } from "lucide-react";
import { Suspense, useEffect, useRef } from "react";
import SignInModal from "~/components/auth/sign-in-modal";
import ArticleComment from "~/components/blog/article-comment";
import ArticleAuthor from "~/components/blog/author";
import LikeButton from "~/components/blog/like-button";
import TableOfContents from "~/components/blog/toc";
import BreadcrumbNavigation from "~/components/breadcrumb-navigation";
import SocialShare from "~/components/social-share";
import { seo } from "~/lib/seo";
import {
  createArticleSchema,
  generateStructuredData,
} from "~/lib/structured-data";
import { useTRPC } from "~/lib/trpc";
import { getBaseUrl } from "~/lib/utils";

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
        slug: data?.slug,
        createdAt: data?.createdAt,
        updatedAt: data?.updatedAt,
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
      image: loaderData?.image,
      author: loaderData?.author,
      type: "article",
      url: `${getBaseUrl()}/blog/${loaderData?.slug}`,
      canonical: `${getBaseUrl()}/blog/${loaderData?.slug}`,
    });

    const articleSchema = loaderData?.title
      ? generateStructuredData(
          createArticleSchema({
            title: loaderData.title,
            description: loaderData.description || "",
            image: loaderData.image || `${getBaseUrl()}/images/cover.avif`,
            datePublished:
              loaderData.createdAt?.toISOString() || new Date().toISOString(),
            dateModified:
              loaderData.updatedAt?.toISOString() || new Date().toISOString(),
            url: `/blog/${loaderData.slug}`,
          })
        )
      : null;

    return {
      meta: seoData.meta,
      links: seoData.links,
      scripts: articleSchema
        ? [
            {
              type: "application/ld+json",
              children: articleSchema,
            },
          ]
        : [],
    };
  },
  component: RouteComponent,
  errorComponent: ({ error }) => <ErrorComponent error={error} />,
  notFoundComponent: () => <NotFound>Article not found</NotFound>,
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

  const readingTime = calculateReadingTime(article.content ?? "");

  return (
    <>
      <article className="relative lg:gap-10 xl:grid xl:max-w-6xl xl:grid-cols-[1fr_280px] 2xl:max-w-7xl">
        <div className="w-full min-w-0">
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.5 }}
          >
            <BreadcrumbNavigation pageTitle={article.title} />
          </motion.div>

          {/* Hero Section */}
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="relative"
            initial={{ opacity: 0, y: 30 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            {/* Background glow effect */}
            <div className="-top-20 -z-10 -translate-x-1/2 pointer-events-none absolute left-1/2 h-64 w-full max-w-2xl">
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(139, 92, 246, 0.08) 0%, transparent 70%)",
                }}
              />
            </div>

            {/* Title and like button */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <h1 className="mt-2 font-heading text-3xl leading-tight tracking-tight sm:text-4xl lg:text-5xl">
                {article.title}
              </h1>
              <div className="sm:mt-3 sm:shrink-0">
                <LikeButton article={article} />
              </div>
            </div>

            {/* Modern metrics bar */}
            <div className="mt-6 flex flex-wrap items-center gap-3">
              {article.createdAt && (
                <div className="inline-flex items-center gap-1.5 rounded-full border border-border/50 bg-muted/50 px-3 py-1.5 text-muted-foreground text-xs backdrop-blur-sm">
                  <Calendar className="size-3.5" />
                  <time dateTime={article.createdAt.toISOString()}>
                    {formatDate(article.createdAt)}
                  </time>
                </div>
              )}
              <div className="inline-flex items-center gap-1.5 rounded-full border border-border/50 bg-muted/50 px-3 py-1.5 text-muted-foreground text-xs backdrop-blur-sm">
                <Clock className="size-3.5" />
                <span>{readingTime} min read</span>
              </div>
              <div className="inline-flex items-center gap-1.5 rounded-full border border-border/50 bg-muted/50 px-3 py-1.5 text-muted-foreground text-xs backdrop-blur-sm">
                <Eye className="size-3.5" />
                <span>{article.viewCount.toLocaleString()} views</span>
              </div>
              <div className="inline-flex items-center gap-1.5 rounded-full border border-rose-200/50 bg-rose-50/50 px-3 py-1.5 text-rose-600 text-xs backdrop-blur-sm dark:border-rose-800/50 dark:bg-rose-950/30 dark:text-rose-400">
                <Heart className="size-3.5" />
                <span>{article.likes} likes</span>
              </div>
              {article.comments && article.comments.length > 0 && (
                <div className="inline-flex items-center gap-1.5 rounded-full border border-border/50 bg-muted/50 px-3 py-1.5 text-muted-foreground text-xs backdrop-blur-sm">
                  <MessageCircle className="size-3.5" />
                  <span>{article.comments.length} comments</span>
                </div>
              )}
            </div>

            {/* Author section with enhanced styling */}
            <motion.div
              animate={{ opacity: 1, y: 0 }}
              className="mt-6"
              initial={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <ArticleAuthor article={article} />
            </motion.div>
          </motion.div>

          {/* Featured image with glow effect */}
          {article.imageUrl && (
            <motion.div
              animate={{ opacity: 1, scale: 1 }}
              className="relative my-8 sm:my-10"
              initial={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              {/* Glow effect behind image */}
              <div className="-inset-2 absolute rounded-3xl bg-linear-to-br from-violet-500/10 via-fuchsia-500/5 to-cyan-500/10 blur-xl" />

              <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-linear-to-br from-white/5 to-white/2 p-1.5 shadow-2xl">
                <LazyImage
                  alt={article.title}
                  className="w-full"
                  fill
                  height={500}
                  imageClassName="rounded-xl object-cover"
                  priority={true}
                  sizes="(max-width: 832px) 100vw, (max-width: 1280px) 75vw, 832px"
                  src={article.imageUrl}
                  width={832}
                />
              </div>
            </motion.div>
          )}

          {/* Article content */}
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <ClientOnly>
              <Suspense fallback={<Spinner className="size-6" />}>
                <article className="prose prose-slate dark:prose-invert max-w-none! prose-headings:font-heading prose-a:text-violet-600 prose-headings:tracking-tight prose-a:no-underline hover:prose-a:text-violet-500 dark:prose-a:text-violet-400 dark:hover:prose-a:text-violet-300">
                  <CustomMDX source={article.content ?? ""} />
                </article>
              </Suspense>
            </ClientOnly>
          </motion.div>

          {/* Tags and share section */}
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="mt-12 border-border/50 border-t pt-8"
            initial={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              {article.tags && article.tags.length > 0 && (
                <div className="flex flex-wrap items-center gap-2">
                  <Tag className="size-4 text-muted-foreground" />
                  {article.tags.map((tag: string) => (
                    <span
                      className="inline-flex items-center rounded-full bg-linear-to-r from-violet-500/10 to-fuchsia-500/10 px-3 py-1 font-medium text-foreground text-xs transition-colors hover:from-violet-500/20 hover:to-fuchsia-500/20"
                      key={tag}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
              <SocialShare
                text={`${article.title} via ${siteConfig.author.handle}`}
                url={`${siteConfig.url}/blog/${articleId}`}
              />
            </div>
          </motion.div>

          {/* Comments section */}
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="mt-12"
            initial={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <ArticleComment articleId={article.id} articleSlug={article.slug} />
          </motion.div>
        </div>

        {/* Table of contents - enhanced sticky sidebar */}
        {article.toc && (
          <motion.div
            animate={{ opacity: 1, x: 0 }}
            className="hidden text-sm xl:block"
            initial={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="-mt-10 sticky top-20 pt-10">
              <TableOfContents toc={article.toc} />
            </div>
          </motion.div>
        )}
      </article>
      <SignInModal />
    </>
  );
}
