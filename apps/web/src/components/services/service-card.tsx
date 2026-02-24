import { ServiceType } from "@acme/types";
import { LazyImage } from "@acme/ui/lazy-image";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Layers } from "lucide-react";
import TechStacks from "../tech-stacks";

interface ServiceCardProps {
  service: ServiceType;
}

const ServiceCard = ({ service }: ServiceCardProps) => {
  const { title, description, slug, imageUrl, stacks } = service;
  const thumbnailUrl =
    imageUrl ??
    `https://placehold.co/500x320/darkgray/white/png?text=${encodeURIComponent(title)}`;

  return (
    <Link
      className="group relative grid h-full cursor-pointer grid-cols-1 overflow-hidden rounded-xl border border-border/50 bg-card shadow-sm transition-all duration-300 hover:border-border hover:shadow-lg hover:shadow-primary/5 sm:rounded-2xl lg:grid-cols-[280px_1fr]"
      params={{
        serviceId: slug,
      }}
      to="/services/$serviceId"
    >
      {/* Image section */}
      <div className="relative aspect-video w-full overflow-hidden lg:aspect-auto lg:h-full">
        <LazyImage
          alt={description ?? ""}
          className="absolute inset-0 h-full w-full"
          fill
          height={180}
          imageClassName="object-cover h-full w-full transition-transform duration-500 group-hover:scale-[1.02]"
          sizes="(max-width: 1024px) 100vw, 280px"
          src={thumbnailUrl}
          width={320}
        />
        <div className="pointer-events-none absolute inset-0 ring-1 ring-black/5 ring-inset dark:ring-white/5" />
      </div>

      {/* Content section */}
      <div className="flex flex-col justify-between gap-3 p-4 sm:gap-4 sm:p-5">
        <div className="flex flex-col gap-2">
          <div className="flex items-start justify-between gap-3">
            <h2 className="font-semibold text-lg tracking-tight">{title}</h2>
            <ArrowRight
              className="mt-0.5 shrink-0 text-muted-foreground transition-all duration-300 group-hover:translate-x-0.5 group-hover:text-primary"
              size={18}
            />
          </div>
          <p className="line-clamp-2 text-muted-foreground text-sm leading-relaxed">
            {description}
          </p>
        </div>

        {/* Tech stack */}
        {stacks && stacks.length > 0 && (
          <div className="flex flex-col gap-2 border-border/50 border-t pt-3 sm:pt-4">
            <span className="flex items-center gap-1.5 text-[10px] text-muted-foreground/60 uppercase tracking-widest">
              <Layers size={10} />
              Stack
            </span>
            <TechStacks techStack={stacks} />
          </div>
        )}
      </div>
    </Link>
  );
};

export default ServiceCard;
