import { LazyImage } from "@acme/ui/lazy-image";
import { Info, LocateIcon } from "lucide-react";

type CoverImageProps = {
  src: string;
  alt: string;
};

export default function CoverImage({ src, alt }: Readonly<CoverImageProps>) {
  return (
    <figure>
      <div className="relative mb-12 w-full">
        <LazyImage
          alt={alt}
          height={620}
          imageClassName="aspect-[16/9] animate-reveal rounded-8 rounded-xl object-cover shadow-xl saturate-0 filter"
          src={src}
          width={1090}
        />

        <div className="absolute right-0 bottom-0 left-0 flex gap-4 rounded-b-xl p-3">
          <div className="h-28 w-28">
            <LazyImage
              alt="Avatar"
              className="h-full rounded-full bg-gradient-to-tl from-purple-700/60 to-rose-400/60 p-[3px] shadow-lg ring-[5px] ring-purple-500/10"
              height={120}
              imageClassName="!m-0 rounded-full object-cover"
              src="/images/avatar.avif"
              width={120}
            />
          </div>

          <div className="flex flex-col justify-between py-2 text-white">
            <span className="font-semibold text-xl">Nauris Linde</span>

            <div className="flex items-center gap-1">
              <LocateIcon size={16} />
              <span className="text-sm">Liepaja, Latvia</span>
            </div>

            <div className="flex items-center gap-1">
              <Info size={16} />
              <span className="text-sm">30 years old</span>
            </div>
          </div>
        </div>
      </div>
    </figure>
  );
}
