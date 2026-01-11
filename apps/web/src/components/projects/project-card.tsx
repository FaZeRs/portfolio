import { ProjectType } from "@acme/types";
import { LazyImage } from "@acme/ui/lazy-image";
import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Sparkles } from "lucide-react";
import TechStacks from "../tech-stacks";

type ProjectCardProps = {
  project: ProjectType;
};

const ProjectCard = ({ project }: ProjectCardProps) => {
  const { title, description, slug, imageUrl, isFeatured, stacks } = project;
  const thumbnailUrl =
    imageUrl ??
    `https://placehold.co/500x320/darkgray/white/png?text=${encodeURIComponent(title)}`;

  return (
    <Link
      className="group relative flex h-full cursor-pointer flex-col overflow-hidden rounded-xl border bg-card transition-all duration-300 hover:border-foreground/20 hover:shadow-xl sm:rounded-2xl"
      params={{
        projectId: slug,
      }}
      to="/projects/$projectId"
    >
      {/* Hover gradient overlay */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-violet-500/5 via-transparent to-pink-500/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      {isFeatured && (
        <div className="absolute top-3 left-3 z-[2] flex items-center gap-1.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 px-2.5 py-0.5 font-medium text-white text-xs shadow-lg sm:top-4 sm:left-4 sm:px-3 sm:py-1">
          <Sparkles size={12} />
          <span>Featured</span>
        </div>
      )}

      {/* Image container */}
      <div className="relative aspect-[16/10] w-full overflow-hidden">
        <LazyImage
          alt={description ?? ""}
          height={320}
          imageClassName="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          src={thumbnailUrl}
          width={500}
        />
        {/* Gradient overlay on image */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        {/* View indicator */}
        <div className="absolute right-4 bottom-4 flex items-center gap-1 rounded-full bg-white/90 px-3 py-1.5 font-medium text-neutral-900 text-sm opacity-0 shadow-lg backdrop-blur-sm transition-all duration-300 group-hover:opacity-100">
          <span>View</span>
          <ArrowUpRight
            className="group-hover:-translate-y-0.5 transition-transform group-hover:translate-x-0.5"
            size={14}
          />
        </div>
      </div>

      {/* Content */}
      <div className="relative flex flex-1 flex-col gap-2 p-4 sm:gap-3 sm:p-5">
        <h3 className="font-semibold text-lg transition-colors group-hover:text-primary">
          {title}
        </h3>
        <p className="line-clamp-2 text-muted-foreground text-sm leading-relaxed">
          {description}
        </p>

        {stacks && stacks.length > 0 && (
          <div className="mt-auto pt-3">
            <TechStacks techStack={stacks} />
          </div>
        )}
      </div>
    </Link>
  );
};

export default ProjectCard;
