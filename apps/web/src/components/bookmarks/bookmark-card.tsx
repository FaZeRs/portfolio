import { Bookmark } from "@acme/types";
import { LazyImage } from "@acme/ui/lazy-image";
import { ExternalLink, Globe } from "lucide-react";

interface BookmarkCardProps {
  bookmark: Bookmark;
}

export default function BookmarkCard({
  bookmark,
}: Readonly<BookmarkCardProps>) {
  return (
    <a
      className="group flex h-full min-w-0 cursor-pointer flex-col overflow-hidden rounded-2xl border bg-card transition-all duration-300 hover:border-foreground/20 hover:shadow-xl"
      href={bookmark.link}
      rel="noopener noreferrer"
      target="_blank"
    >
      {/* Hover gradient overlay */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-violet-500/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      {/* Image */}
      <div className="relative aspect-[1200/630] overflow-hidden">
        <LazyImage
          alt={bookmark.title}
          className="h-full w-full"
          fill
          height={260}
          imageClassName="object-cover transition-transform duration-500 group-hover:scale-105 bg-[url('/images/fallback.webp')] bg-center bg-cover bg-no-repeat"
          src={bookmark.cover}
          width={500}
        />
        {/* Hover indicator */}
        <div className="absolute right-3 bottom-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-neutral-900 opacity-0 shadow-lg backdrop-blur-sm transition-all duration-300 group-hover:opacity-100">
          <ExternalLink size={14} />
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="line-clamp-1 font-semibold transition-colors group-hover:text-primary">
          {bookmark.title}
        </h3>
        <span className="inline-flex items-center gap-1.5 text-muted-foreground text-xs">
          <Globe size={12} />
          {bookmark.domain}
        </span>
        {(bookmark.excerpt || bookmark.note) && (
          <p className="line-clamp-2 text-muted-foreground text-sm leading-relaxed">
            {bookmark.excerpt || bookmark.note}
          </p>
        )}
      </div>
    </a>
  );
}
