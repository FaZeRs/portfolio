import { siteConfig } from "@acme/config";
import { CustomMDX } from "@acme/mdx";
import ProjectLink from "@acme/shared/link";
import { STACKS } from "@acme/shared/stack";
import Icon from "@acme/ui/icon";
import { NotFound } from "@acme/ui/not-found";
import { Spinner } from "@acme/ui/spinner";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@acme/ui/tooltip";
import ZoomImage from "@acme/ui/zoom-image";
import { useSuspenseQuery } from "@tanstack/react-query";
import {
  ClientOnly,
  createFileRoute,
  ErrorComponent,
  notFound,
} from "@tanstack/react-router";
import { TRPCClientError } from "@trpc/client";
import { motion } from "framer-motion";
import { Code2, ExternalLink, Sparkles } from "lucide-react";
import { Suspense } from "react";
import { siGithub } from "simple-icons";
import TableOfContents from "~/components/blog/toc";
import BreadcrumbNavigation from "~/components/breadcrumb-navigation";
import { seo } from "~/lib/seo";
import {
  generateStructuredDataGraph,
  getProjectSchemas,
} from "~/lib/structured-data";
import { useTRPC } from "~/lib/trpc";
import { getBaseUrl } from "~/lib/utils";

export const Route = createFileRoute("/(public)/projects/$projectId")({
  loader: async ({ params: { projectId }, context: { trpc, queryClient } }) => {
    try {
      const data = await queryClient.ensureQueryData(
        trpc.project.bySlug.queryOptions({ slug: projectId })
      );
      return {
        title: data?.title,
        description: data?.description,
        image: data?.imageUrl,
        slug: data?.slug,
        githubUrl: data?.githubUrl,
        stacks: data?.stacks,
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
      url: `${getBaseUrl()}/projects/${loaderData?.slug}`,
      canonical: `${getBaseUrl()}/projects/${loaderData?.slug}`,
    });

    const structuredData = loaderData?.title
      ? generateStructuredDataGraph(
          getProjectSchemas({
            title: loaderData.title,
            description: loaderData.description || "",
            slug: loaderData.slug || "",
            image: loaderData.image ?? undefined,
            githubUrl: loaderData.githubUrl ?? undefined,
            stacks: loaderData.stacks ?? undefined,
            dateCreated: loaderData.createdAt?.toISOString(),
            dateModified: loaderData.updatedAt?.toISOString(),
          })
        )
      : null;

    return {
      meta: seoData.meta,
      links: seoData.links,
      scripts: structuredData
        ? [
            {
              type: "application/ld+json",
              children: structuredData,
            },
          ]
        : [],
    };
  },
  component: RouteComponent,
  errorComponent: ({ error }) => <ErrorComponent error={error} />,
  notFoundComponent: () => <NotFound>Project not found</NotFound>,
});

function RouteComponent() {
  const { projectId } = Route.useParams();
  const trpc = useTRPC();
  const { data: project } = useSuspenseQuery(
    trpc.project.bySlug.queryOptions({ slug: projectId })
  );

  if (!project) {
    return null;
  }

  const {
    title,
    description,
    stacks,
    githubUrl,
    demoUrl,
    imageUrl,
    content,
    isFeatured,
    toc,
  } = project;
  const thumbnailUrl =
    imageUrl ??
    `https://placehold.co/1200x630/darkgray/white/png?text=${encodeURIComponent(title)}`;

  return (
    <article className="relative lg:gap-10 xl:grid xl:max-w-6xl xl:grid-cols-[1fr_280px] 2xl:max-w-7xl">
      <div className="w-full min-w-0">
        {/* Breadcrumb */}
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
        >
          <BreadcrumbNavigation
            pageTitle={title}
            section={{ label: "Projects", href: "/projects" }}
          />
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

          {/* Title section */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <h1 className="font-heading text-3xl leading-tight tracking-tight sm:text-4xl lg:text-5xl">
                  {title}
                </h1>
                {isFeatured && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-linear-to-r from-amber-500 to-orange-500 px-3 py-1 font-medium text-white text-xs shadow-lg">
                    <Sparkles size={12} />
                    Featured
                  </span>
                )}
              </div>
              {description && (
                <p className="max-w-2xl text-muted-foreground leading-relaxed md:text-lg">
                  {description}
                </p>
              )}
            </div>
          </div>

          {/* Tech stack and links bar */}
          <div className="mt-8 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            {/* Tech stack */}
            {stacks && stacks.length > 0 && (
              <motion.div
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-wrap items-center gap-3"
                initial={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <span className="inline-flex items-center gap-1.5 rounded-full border border-border/50 bg-muted/50 px-3 py-1.5 text-muted-foreground text-xs backdrop-blur-sm">
                  <Code2 className="size-3.5" />
                  Tech Stack
                </span>
                <div className="flex flex-wrap items-center gap-2">
                  {stacks.map((stack) => (
                    <TooltipProvider delayDuration={200} key={stack}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm transition-all hover:scale-110 hover:border-foreground/20 hover:bg-muted hover:shadow-lg">
                            {STACKS[stack] && (
                              <Icon className="h-4 w-4" icon={STACKS[stack]} />
                            )}
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <span className="font-medium">{stack}</span>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Project links */}
            <motion.div
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-3"
              initial={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: 0.25 }}
            >
              {githubUrl && (
                <ProjectLink
                  icon={<Icon className="h-4 w-4" icon={siGithub} />}
                  title="Source Code"
                  url={githubUrl}
                />
              )}
              {demoUrl && (
                <ProjectLink
                  icon={<ExternalLink className="h-4 w-4" />}
                  title="Live Demo"
                  url={demoUrl}
                />
              )}
            </motion.div>
          </div>
        </motion.div>

        {/* Featured image with glow effect */}
        <motion.div
          animate={{ opacity: 1, scale: 1 }}
          className="relative my-10"
          initial={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {/* Glow effect behind image */}
          <div className="-inset-3 absolute rounded-3xl bg-linear-to-br from-violet-500/10 via-fuchsia-500/5 to-cyan-500/10 blur-xl" />

          <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-linear-to-br from-white/5 to-white/2 p-1.5 shadow-2xl">
            <ZoomImage
              alt={title}
              className="w-full rounded-xl"
              height={630}
              src={thumbnailUrl}
              width={1200}
            />
          </div>
        </motion.div>

        {/* Project content */}
        {content && (
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="mt-12"
            initial={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <ClientOnly>
              <Suspense fallback={<Spinner className="size-6" />}>
                <div className="prose prose-slate dark:prose-invert max-w-none! prose-headings:font-heading prose-a:text-violet-600 prose-headings:tracking-tight prose-a:no-underline hover:prose-a:text-violet-500 dark:prose-a:text-violet-400 dark:hover:prose-a:text-violet-300">
                  <CustomMDX source={content} />
                </div>
              </Suspense>
            </ClientOnly>
          </motion.div>
        )}
      </div>

      {/* Table of contents - sticky sidebar */}
      {toc && toc.length > 0 && (
        <motion.div
          animate={{ opacity: 1, x: 0 }}
          className="hidden text-sm xl:block"
          initial={{ opacity: 0, x: 20 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="-mt-10 sticky top-20 pt-10">
            <TableOfContents toc={toc} />
          </div>
        </motion.div>
      )}
    </article>
  );
}
