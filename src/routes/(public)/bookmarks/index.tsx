import { createFileRoute, Link } from "@tanstack/react-router";
import PageHeading from "~/components/page-heading";
import { ScrollArea } from "~/components/ui/scroll-area";
import { getCollections } from "~/lib/raindrop";
import { Collection } from "~/types";

export const Route = createFileRoute("/(public)/bookmarks/")({
  loader: async () => {
    const result = await getCollections();
    return { collections: result.items };
  },
  component: RouteComponent,
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
