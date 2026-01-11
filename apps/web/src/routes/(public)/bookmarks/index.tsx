import { siteConfig } from "@acme/config";
import { Collection } from "@acme/types";
import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, Bookmark, FolderOpen } from "lucide-react";
import PageHeading from "~/components/page-heading";
import { getCollections } from "~/lib/raindrop";
import { seo } from "~/lib/seo";
import { getBaseUrl } from "~/lib/utils";

export const Route = createFileRoute("/(public)/bookmarks/")({
  loader: async () => {
    const result = await getCollections();
    return { collections: result.items };
  },
  component: RouteComponent,
  head: () => {
    const seoData = seo({
      title: `Bookmarks | ${siteConfig.title}`,
      description: "Discoveries from the World Wide Web",
      keywords: siteConfig.keywords,
      url: `${getBaseUrl()}/bookmarks`,
      canonical: `${getBaseUrl()}/bookmarks`,
    });
    return {
      meta: seoData.meta,
      links: seoData.links,
    };
  },
});

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4 },
  },
};

function RouteComponent() {
  const { collections } = Route.useLoaderData();

  return (
    <>
      <PageHeading
        description="Discoveries from the World Wide Web"
        title="Bookmarks"
      />

      <motion.div
        animate="visible"
        className="grid gap-4 sm:grid-cols-2"
        initial="hidden"
        variants={containerVariants}
      >
        {collections.map((collection: Collection) => (
          <motion.div key={collection._id} variants={itemVariants}>
            <Link
              className="group relative flex h-full cursor-pointer flex-col overflow-hidden rounded-2xl border border-border/50 bg-card p-5 transition-all duration-300 hover:border-border hover:shadow-lg hover:shadow-primary/5"
              params={{
                bookmarkId: collection.slug,
              }}
              to="/bookmarks/$bookmarkId"
            >
              {/* Hover gradient overlay */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-violet-500/5 via-transparent to-cyan-500/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

              <div className="relative flex items-start justify-between gap-3">
                {/* Icon */}
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500/10 to-pink-500/10 text-violet-600 dark:text-violet-400">
                  <FolderOpen size={20} />
                </div>

                {/* Arrow indicator */}
                <ArrowRight
                  className="mt-2 shrink-0 text-muted-foreground/50 transition-all duration-300 group-hover:translate-x-0.5 group-hover:text-primary"
                  size={18}
                />
              </div>

              <div className="relative mt-4 flex flex-1 flex-col gap-2">
                <h2 className="font-semibold text-lg tracking-tight transition-colors group-hover:text-primary">
                  {collection.title}
                </h2>
                <span className="inline-flex items-center gap-1.5 text-muted-foreground text-sm">
                  <Bookmark size={14} />
                  {collection.count} bookmarks
                </span>
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </>
  );
}
