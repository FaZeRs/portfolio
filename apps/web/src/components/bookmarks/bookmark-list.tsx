import { Bookmark } from "@acme/types";
import { motion } from "framer-motion";
import BookmarkCard from "~/components/bookmarks/bookmark-card";
import LoadMore from "~/components/bookmarks/load-more";
import { PAGE_SIZE } from "~/lib/raindrop";

type BookmarkListProps = {
  id: number;
  initialBookmarks: Bookmark[];
};

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

export default function BookmarkList({
  id,
  initialBookmarks,
}: Readonly<BookmarkListProps>) {
  const isLoadMoreEnabled = PAGE_SIZE <= initialBookmarks.length;

  return (
    <div className="space-y-8">
      <motion.div
        animate="visible"
        className="grid gap-4 sm:grid-cols-2"
        initial="hidden"
        variants={containerVariants}
      >
        {initialBookmarks.map((bookmark) => (
          <motion.div key={bookmark._id} variants={itemVariants}>
            <BookmarkCard bookmark={bookmark} />
          </motion.div>
        ))}
      </motion.div>

      {isLoadMoreEnabled && <LoadMore id={id} />}
    </div>
  );
}
