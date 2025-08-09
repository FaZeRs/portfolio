import { createFileRoute } from "@tanstack/react-router";
import BookmarkList from "~/components/bookmarks/bookmark-list";
import PageHeading from "~/components/page-heading";
import {
  getBookmarksByCollectionId,
  getCollection,
  getCollections,
} from "~/lib/raindrop";
import { Collection } from "~/types";

export const Route = createFileRoute("/_defaultLayout/bookmarks/$bookmarkId")({
  component: RouteComponent,
  loader: async ({ params }) => {
    const collections = await getCollections();
    if (!collections) return;

    const currentCollection = collections.items.find(
      (collection: Collection) => collection.slug === params.bookmarkId,
    );
    if (!currentCollection) return;

    const [collection, bookmarks] = await Promise.all([
      getCollection({ data: { id: currentCollection._id } }),
      getBookmarksByCollectionId({
        data: {
          collectionId: currentCollection._id,
        },
      }),
    ]);

    return { collection, bookmarks };
  },
});

function RouteComponent() {
  const result = Route.useLoaderData();

  if (!result) {
    return null;
  }

  const { collection, bookmarks } = result;

  return (
    <>
      <PageHeading
        title={collection.item.title}
        description={collection.item.description}
      />

      <BookmarkList
        id={collection.item._id}
        initialBookmarks={bookmarks.items}
      />
    </>
  );
}
