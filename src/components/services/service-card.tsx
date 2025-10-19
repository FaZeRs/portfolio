import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

import { ServiceType } from "~/types";
import { LazyImage } from "../lazy-image";
import TechStacks from "../tech-stacks";

type ServiceCardProps = {
  service: ServiceType;
};

const ServiceCard = ({ service }: ServiceCardProps) => {
  const { title, description, slug, imageUrl, stacks } = service;
  const thumbnailUrl =
    imageUrl ??
    `https://placehold.co/500x320/darkgray/white/png?text=${encodeURIComponent(title)}`;

  return (
    <Link
      className="group relative flex h-full cursor-pointer flex-col overflow-hidden rounded-xl border bg-background shadow-sm transition-all duration-300 hover:border-foreground/20 hover:shadow-lg md:flex-row"
      params={{
        serviceId: slug,
      }}
      to="/services/$serviceId"
    >
      <div className="relative aspect-[2/1] w-full overflow-hidden md:aspect-auto md:w-2/5">
        <LazyImage
          alt={description ?? ""}
          height={320}
          imageClassName="object-cover transition-colors"
          sizes="(max-width: 768px) 100vw, 40vw"
          src={thumbnailUrl}
          width={500}
        />
        <div className="absolute top-0 left-0 flex h-full w-full items-center justify-center gap-1 bg-black font-medium text-sm text-white opacity-0 transition-opacity duration-300 group-hover:opacity-80">
          <span>View Service</span>
          <ArrowRight size={20} />
        </div>
      </div>

      <div className="flex flex-1 flex-col justify-between gap-4 p-6 md:w-3/5">
        <div className="flex flex-col gap-3">
          <h2 className="font-bold text-2xl text-neutral-900 transition-colors duration-300 group-hover:text-primary dark:text-neutral-100">
            {title}
          </h2>
          <p className="line-clamp-3 text-muted-foreground leading-relaxed">
            {description}
          </p>
        </div>

        {stacks && stacks.length > 0 && (
          <div className="flex flex-col gap-2">
            <span className="font-medium text-muted-foreground text-xs uppercase tracking-wider">
              Technologies
            </span>
            <TechStacks techStack={stacks} />
          </div>
        )}
      </div>
    </Link>
  );
};

export default ServiceCard;
