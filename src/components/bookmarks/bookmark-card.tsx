import { Link2Icon } from "lucide-react";
import { Bookmark } from "~/types";
import { LazyImage } from "../lazy-image";

type BookmarkCardProps = {
  bookmark: Bookmark;
};
export default function BookmarkCard({
  bookmark,
}: Readonly<BookmarkCardProps>) {
  return (
    <a
      className="flex aspect-auto h-full min-w-0 cursor-pointer flex-col gap-4 overflow-hidden rounded-xl border bg-background p-4 transition-colors duration-300 hover:bg-gray-200 dark:hover:bg-gray-800"
      href={bookmark.link}
      rel="noopener noreferrer"
      target="_blank"
    >
      <span className="aspect-[1200/630] overflow-hidden rounded-lg">
        <LazyImage
          alt={bookmark.title}
          className="aspect-[1200/630] animate-reveal rounded-lg"
          height={260}
          imageClassName="rounded-lg object-cover border bg-[url('/images/fallback.webp')] bg-center bg-cover bg-no-repeat"
          src={bookmark.cover}
          width={500}
        />
      </span>

      <div className="flex flex-1 flex-col gap-1">
        <h3 className="line-clamp-1">{bookmark.title}</h3>
        <span className="line-clamp-1 inline-flex items-center gap-1 text-muted-foreground text-sm">
          <Link2Icon size={16} />
          {bookmark.domain}
        </span>
        <span className="line-clamp-3 text-sm">
          {bookmark.excerpt || bookmark.note}
        </span>
      </div>
    </a>
  );
}
