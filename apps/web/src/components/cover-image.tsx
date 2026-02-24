import { LazyImage } from "@acme/ui/lazy-image";
import { Briefcase, MapPin } from "lucide-react";

interface CoverImageProps {
  alt: string;
  src: string;
}

export default function CoverImage({ src, alt }: Readonly<CoverImageProps>) {
  return (
    <figure>
      <div className="relative w-full overflow-hidden rounded-2xl">
        <LazyImage
          alt={alt}
          height={400}
          imageClassName="aspect-[16/9] object-cover saturate-0 sm:aspect-[2/1] lg:aspect-[3/1]"
          src={src}
          width={1200}
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

        {/* Profile info overlay */}
        <div className="absolute right-0 bottom-0 left-0 p-4 sm:p-6 md:p-8">
          <div className="flex items-end gap-4 sm:gap-5">
            {/* Avatar */}
            <div className="relative shrink-0">
              <div className="absolute -inset-1 rounded-full bg-gradient-to-br from-violet-500 to-pink-500 blur-sm" />
              <LazyImage
                alt="Avatar"
                className="relative"
                height={96}
                imageClassName="h-16 w-16 sm:h-20 sm:w-20 md:h-24 md:w-24 rounded-full object-cover border-3 sm:border-4 border-background"
                src="/images/avatar.avif"
                width={96}
              />
            </div>

            {/* Info */}
            <div className="flex min-w-0 flex-col gap-0.5 pb-0.5 text-white sm:gap-1 sm:pb-1">
              <h2 className="truncate font-bold text-lg sm:text-xl md:text-2xl">
                Nauris Linde
              </h2>
              <div className="flex flex-wrap items-center gap-2 text-white/80 text-xs sm:gap-3 sm:text-sm">
                <span className="flex items-center gap-1">
                  <MapPin className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                  Liepaja, Latvia
                </span>
                <span className="flex items-center gap-1">
                  <Briefcase className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                  R&D Engineer
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </figure>
  );
}
