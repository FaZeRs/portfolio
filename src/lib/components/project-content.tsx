import { Share } from "lucide-react";
import { Suspense, lazy } from "react";
import { siGithub } from "simple-icons";

import Icon from "~/lib/components/ui/icon";

import type { ProjectType } from "~/types";

import ProjectLink from "./project-link";
import ProjectStacks from "./project-stacks";

const CustomMDX = lazy(() => import("./mdx/mdx"));

interface ProjectContentProps {
  project: ProjectType;
}

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
                  key={link.title}
                  title={link.title}
                  url={link.url}
                  icon={link.icon}
                />
              ),
          )}
        </div>
      </div>

      <div className="relative aspect-[16/9] overflow-hidden">
        <img
          src={thumbnailUrl}
          alt={title}
          className="scale-100 rounded-lg border object-cover blur-0 grayscale-0 duration-700 ease-in-out hover:scale-105"
        />
      </div>

      {content && (
        <div className="mt-5 space-y-6 leading-[1.8] dark:text-neutral-300">
          <Suspense fallback={<div>Loading...</div>}>
            <CustomMDX source={content} />
          </Suspense>
        </div>
      )}
    </div>
  );
}
