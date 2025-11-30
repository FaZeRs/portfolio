import { Bookmark } from "@acme/types";
import { Loader } from "lucide-react";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import BookmarkCard from "~/components/bookmarks/bookmark-card";
import { getBookmarksByCollectionId, PAGE_SIZE } from "~/lib/raindrop";

type LoadMoreProps = {
  id: number;
};

export default function LoadMore({ id }: Readonly<LoadMoreProps>) {
  const { ref, inView } = useInView();

  const [data, setData] = useState<Bookmark[]>([]);
  const [pageIndex, setPageIndex] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isReachingEnd, setIsReachingEnd] = useState(false);

  const isInfiniteScrollEnabled = inView && isLoading && !isReachingEnd;

  useEffect(() => {
    if (inView && !isReachingEnd) {
      setIsLoading(true);

      const delay = 500;

      const timeoutId = setTimeout(async () => {
        const newBookmarks = await getBookmarksByCollectionId({
          data: {
            collectionId: id,
            pageIndex,
          },
        });

        if (PAGE_SIZE > newBookmarks.items.length) {
          setIsReachingEnd(true);
        }

        setData((prev) => [...prev, ...newBookmarks.items]);
        setPageIndex(pageIndex + 1);
        setIsLoading(false);
      }, delay);

      // Clear the timeout if the component is unmounted or inView becomes false
      return () => clearTimeout(timeoutId);
    }
  }, [inView, id, isReachingEnd, pageIndex]);

  return (
    <>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {data.map((bookmark) => (
          <BookmarkCard bookmark={bookmark} key={bookmark._id} />
        ))}
      </div>

      <section className="mt-4 flex w-full items-center justify-center">
        <div ref={ref}>
          {isInfiniteScrollEnabled ? (
            <Loader className="size-6 animate-spin" />
          ) : (
            <span>{`That's all for now. Come back later for more.`}</span>
          )}
        </div>
      </section>
    </>
  );
}
