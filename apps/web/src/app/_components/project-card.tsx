"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, PinIcon } from "lucide-react";

import type { Project } from "~/types/project";
import ProjectStacks from "./project-stacks";

interface ProjectCardProps {
  project: Project;
}

const ProjectCard = ({ project }: ProjectCardProps) => {
  const { title, description, slug, imageUrl, isFeature, stack } = project;
  const thumbnailUrl =
    imageUrl ??
    `https://placehold.co/600x400/darkgray/white/png?text=${encodeURIComponent(
      title,
    )}`;
  return (
    <Link
      href={`/projects/${slug}`}
      className="group relative flex h-full cursor-pointer flex-col rounded-lg border bg-background p-4 dark:bg-white/10"
    >
      {isFeature && (
        <div className="absolute right-0 top-0 z-[2] flex items-center gap-1 rounded-bl-lg rounded-tr-lg bg-lime-300 px-2 py-1 text-[13px] font-medium text-emerald-950">
          <PinIcon size={15} />
          <span>Featured</span>
        </div>
      )}

      <div className="relative aspect-[2/1] w-full overflow-hidden rounded-md border">
        <Image
          src={thumbnailUrl}
          alt={description}
          width={1200}
          height={630}
          quality={50}
          className="animate-reveal rounded-md object-cover transition-all group-hover:scale-105"
        />
        <div className="absolute left-0 top-0 flex h-full w-full items-center justify-center gap-1 rounded-md bg-black text-sm font-medium text-white opacity-0 transition-opacity duration-300 group-hover:opacity-80">
          <span>View Project</span>
          <ArrowRight size={20} />
        </div>
      </div>

      <div className="mt-4 flex flex-1 flex-col gap-3">
        <h1 className="font-bold text-neutral-900 dark:text-neutral-200">
          {title}
        </h1>
        <p className="line-clamp-5 text-sm text-muted-foreground">
          {description}
        </p>

        <ProjectStacks projectStack={stack} />
      </div>
    </Link>
  );
};

export default ProjectCard;
