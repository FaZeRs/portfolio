import { notFound } from "next/navigation";

import ProjectContent from "~/app/_components/project-content";
import { projectsData } from "~/constants/projects-data";
import PageHeading from "../../_components/page-heading";

interface ProjectPageProps {
  params: {
    slug: string;
  };
}

export function generateStaticParams() {
  return projectsData.map((project) => ({
    slug: project.slug,
  }));
}

export default function ProjectPage({ params }: Readonly<ProjectPageProps>) {
  const slug = params.slug;
  const project = projectsData.find((project) => project.slug === slug);
  if (!project) return notFound();

  return (
    <div>
      <PageHeading title={project.title} description={project.description} />
      <ProjectContent project={project} />
    </div>
  );
}
