import { Bookmark } from "@acme/types";
import BookmarkCard from "~/components/bookmarks/bookmark-card";
import LoadMore from "~/components/bookmarks/load-more";
import { PAGE_SIZE } from "~/lib/raindrop";

type BookmarkListProps = {
  id: number;
  initialBookmarks: Bookmark[];
};

export default function BookmarkList({
  id,
  initialBookmarks,
}: Readonly<BookmarkListProps>) {
  const isLoadMoreEnabled = PAGE_SIZE <= initialBookmarks.length;

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2">
        {initialBookmarks.map((bookmark) => (
          <BookmarkCard bookmark={bookmark} key={bookmark._id} />
        ))}
      </div>

      {isLoadMoreEnabled && <LoadMore id={id} />}
    </>
  );
}
