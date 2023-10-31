"use client";

import { Spinner } from "~/app/_components/spinner";
import { api } from "~/trpc/react";
import ExperienceItem from "./experience-item";

const ExperiencesList = () => {
  const { data, isLoading } = api.experience.list.useQuery();

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
    <div className="relative mx-auto mt-12 flex w-full flex-col lg:w-2/3">
      <div>
        <span className="absolute inset-y-0 left-[40%] ml-10 hidden w-0.5 bg-gray-500 md:block" />
        {data.map((item) => (
          <ExperienceItem key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
};

export default ExperiencesList;
