import { Link } from "@tanstack/react-router";
import { ArrowRight, PinIcon } from "lucide-react";

import { ProjectType } from "~/types";
import { LazyImage } from "../lazy-image";
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
      className="group relative flex h-full cursor-pointer flex-col rounded-lg border bg-background p-4 dark:bg-white/10"
      params={{
        projectId: slug,
      }}
      to="/projects/$projectId"
    >
      {isFeatured && (
        <div className="absolute top-0 right-0 z-[2] flex items-center gap-1 rounded-tr-lg rounded-bl-lg bg-lime-300 px-2 py-1 font-medium text-[13px] text-emerald-950">
          <PinIcon size={15} />
          <span>Featured</span>
        </div>
      )}

      <div className="relative aspect-[2/1] w-full overflow-hidden rounded-xl border">
        <LazyImage
          alt={description ?? ""}
          height={320}
          imageClassName="object-cover rounded-xl transition-colors"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          src={thumbnailUrl}
          width={500}
        />
        <div className="absolute top-0 left-0 flex h-full w-full items-center justify-center gap-1 rounded-xl bg-black font-medium text-sm text-white opacity-0 transition-opacity duration-300 group-hover:opacity-80">
          <span>View Project</span>
          <ArrowRight size={20} />
        </div>
      </div>

      <div className="mt-4 flex flex-1 flex-col gap-3">
        <h1 className="font-bold text-neutral-900 dark:text-neutral-200">
          {title}
        </h1>
        <p className="line-clamp-5 text-muted-foreground text-sm">
          {description}
        </p>

        <TechStacks techStack={stacks} />
      </div>
    </Link>
  );
};

export default ProjectCard;
