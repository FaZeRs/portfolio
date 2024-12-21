import Image from "next/image";
import { Share } from "lucide-react";
import { siGithub } from "simple-icons";

import Icon from "@acme/ui/icon";

import type { Project } from "~/types/project";
import { CustomMDX } from "./mdx/mdx";
import ProjectLink from "./project-link";
import ProjectStacks from "./project-stacks";

interface ProjectContentProps {
  project: Project;
}

export default function ProjectContent({
  project,
}: Readonly<ProjectContentProps>) {
  const { projectStack, githubUrl, demoUrl, imageUrl, title, content } =
    project;

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
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-[15px] font-medium text-neutral-700 dark:text-neutral-300">
            Tech Stack :
          </span>

          <ProjectStacks projectStack={projectStack} />
        </div>

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
        <Image
          src={imageUrl}
          alt={title}
          fill
          className="scale-100 rounded-lg border object-cover blur-0 grayscale-0 duration-700 ease-in-out hover:scale-105"
        />
      </div>

      {content && (
        <div className="mt-5 space-y-6 leading-[1.8] dark:text-neutral-300">
          <CustomMDX source={content} />
        </div>
      )}
    </div>
  );
}
