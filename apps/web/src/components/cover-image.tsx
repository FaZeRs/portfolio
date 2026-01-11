import { LazyImage } from "@acme/ui/lazy-image";
import { Briefcase, MapPin } from "lucide-react";

type CoverImageProps = {
  src: string;
  alt: string;
};

export default function CoverImage({ src, alt }: Readonly<CoverImageProps>) {
  return (
    <figure className="mb-12">
      <div className="relative w-full overflow-hidden rounded-2xl">
        {/* Cover image */}
        <LazyImage
          alt={alt}
          height={300}
          imageClassName="aspect-[21/9] object-cover saturate-0"
          src={src}
          width={1090}
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        {/* Profile info overlay */}
        <div className="absolute right-0 bottom-0 left-0 p-6 md:p-8">
          <div className="flex items-end gap-5">
            {/* Avatar */}
            <div className="relative">
              <div className="-inset-1 absolute rounded-full bg-gradient-to-br from-violet-500 to-pink-500 blur-sm" />
              <LazyImage
                alt="Avatar"
                className="relative"
                height={100}
                imageClassName="h-20 w-20 md:h-24 md:w-24 rounded-full object-cover border-4 border-background"
                src="/images/avatar.avif"
                width={100}
              />
            </div>

            {/* Info */}
            <div className="flex flex-col gap-1 pb-1 text-white">
              <h2 className="font-bold text-xl md:text-2xl">Nauris Linde</h2>
              <div className="flex flex-wrap items-center gap-3 text-sm text-white/80">
                <span className="flex items-center gap-1">
                  <MapPin size={14} />
                  Liepaja, Latvia
                </span>
                <span className="flex items-center gap-1">
                  <Briefcase size={14} />
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
