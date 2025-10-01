import { ClientOnly } from "@tanstack/react-router";
import { Loader, Share } from "lucide-react";
import { lazy, Suspense } from "react";
import { siGithub } from "simple-icons";
import Icon from "~/components/ui/icon";
import type { ProjectType } from "~/types";
import ZoomImage from "../zoom-image";
import ProjectLink from "./project-link";
import ProjectStacks from "./project-stacks";

const CustomMDX = lazy(() => import("../mdx/mdx"));

type ProjectContentProps = {
  project: ProjectType;
};

export default function ProjectContent({
  project,
}: Readonly<ProjectContentProps>) {
  const { stacks, githubUrl, demoUrl, imageUrl, title, content } = project;
  const thumbnailUrl =
    imageUrl ??
    `https://placehold.co/1000x600/darkgray/white/png?text=${encodeURIComponent(title)}`;

  const projectLinks = [
    {
      title: "Source code",
      url: githubUrl,
      icon: <Icon icon={siGithub} />,
    },
    {
      title: "Live demo",
      url: demoUrl,
      icon: <Share />,
    },
  ];
  return (
    <div className="space-y-8">
      <div className="flex flex-col justify-between gap-5 sm:flex-row lg:items-center">
        {stacks && stacks.length > 0 && (
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-medium text-[15px] text-neutral-700 dark:text-neutral-300">
              Tech Stack :
            </span>

            <ProjectStacks projectStack={stacks} />
          </div>
        )}

        <div className="flex items-center gap-4">
          {projectLinks.map(
            (link) =>
              link.url && (
                <ProjectLink
                  icon={link.icon}
                  key={link.title}
                  title={link.title}
                  url={link.url}
                />
              )
          )}
        </div>
      </div>

      <div className="relative aspect-[16/9] overflow-hidden">
        <ZoomImage
          alt={title}
          className="scale-100 rounded-lg border object-cover blur-0 grayscale-0 duration-700 ease-in-out hover:scale-105"
          height={600}
          src={thumbnailUrl}
          width={1000}
        />
      </div>

      {content && (
        <div className="mt-5 space-y-6 leading-[1.8] dark:text-neutral-300">
          <ClientOnly>
            <Suspense fallback={<Loader className="size-6 animate-spin" />}>
              <article className="prose prose-slate dark:prose-invert !max-w-none">
                <CustomMDX source={content} />
              </article>
            </Suspense>
          </ClientOnly>
        </div>
      )}
    </div>
  );
}
