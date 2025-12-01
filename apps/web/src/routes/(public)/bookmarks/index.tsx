import { siteConfig } from "@acme/config";
import { Collection } from "@acme/types";
import { ScrollArea } from "@acme/ui/scroll-area";
import { createFileRoute, Link } from "@tanstack/react-router";
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

function RouteComponent() {
  const { collections } = Route.useLoaderData();
  return (
    <>
      <PageHeading
        description="Discoveries from the World Wide Web"
        title="Bookmarks"
      />

      <ScrollArea>
        <div className="divide-y">
          {collections.map((collection: Collection) => (
            <Link
              className="flex flex-col gap-1 px-2 py-3 text-sm hover:bg-gray-200 dark:hover:bg-gray-800"
              key={collection._id}
              params={{
                bookmarkId: collection.slug,
              }}
              to="/bookmarks/$bookmarkId"
            >
              <div>
                <h2 className="font-semibold text-lg">{collection.title}</h2>
                <span className="text-muted-foreground">
                  {collection.count} bookmarks
                </span>
              </div>
            </Link>
          ))}
        </div>
      </ScrollArea>
    </>
  );
}
