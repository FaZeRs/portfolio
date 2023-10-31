"use client";

import { Spinner } from "~/app/_components/spinner";
import { api } from "~/trpc/react";
import ProjectItem from "./project-item";

const ProjectsList = () => {
  const { data, isLoading } = api.project.list.useQuery();

  if (isLoading)
    return (
      <div className="mt-12 flex items-center justify-center">
        <Spinner size={60} />
      </div>
    );

  if (!data)
    return (
      <div className="mt-12 flex items-center justify-center">
        Something went wrong
      </div>
    );

  return (
    <div className="mx-auto grid w-full grid-cols-1 gap-8 pt-12 sm:w-3/4 md:gap-10 lg:w-full lg:grid-cols-3">
      {data.map((item) => (
        <ProjectItem key={item.id} item={item} />
      ))}
    </div>
  );
};

export default ProjectsList;
