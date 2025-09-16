import { createFileRoute } from "@tanstack/react-router";
import BookmarkList from "~/components/bookmarks/bookmark-list";
import PageHeading from "~/components/page-heading";
import { siteConfig } from "~/lib/config/site";
import {
  getBookmarksByCollectionId,
  getCollection,
  getCollections,
} from "~/lib/raindrop";
import { seo } from "~/lib/seo";
import { getBaseUrl } from "~/lib/utils";
import { Collection } from "~/types";

export const Route = createFileRoute("/(public)/bookmarks/$bookmarkId")({
  component: RouteComponent,
  loader: async ({ params }) => {
    const collections = await getCollections();
    if (!collections) {
      return;
    }

    const currentCollection = collections.items.find(
      (c: Collection) => c.slug === params.bookmarkId
    );
    if (!currentCollection) {
      return;
    }

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
  head: ({ loaderData }) => {
    const seoData = seo({
      title: `${loaderData?.collection.item.title} | ${siteConfig.title}`,
      description: "Discoveries from the World Wide Web",
      keywords: siteConfig.keywords,
      url: `${getBaseUrl()}/bookmarks/${loaderData?.collection.item.slug}`,
      canonical: `${getBaseUrl()}/bookmarks/${loaderData?.collection.item.slug}`,
    });
    return {
      meta: seoData.meta,
      links: seoData.links,
    };
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
        description={collection.item.description}
        title={collection.item.title}
      />

      <BookmarkList
        id={collection.item._id}
        initialBookmarks={bookmarks.items}
      />
    </>
  );
}
