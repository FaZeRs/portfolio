"use client";

import Image from "next/image";
import { ChevronRightIcon } from "@heroicons/react/24/solid";
import Head from "~/app/_components/head";
import { Spinner } from "~/app/_components/spinner";
import { api } from "~/trpc/react";
import { RouterOutputs } from "~/trpc/shared";
import { formatDate } from "~/utils/format-date";

type Experience = RouterOutputs["experience"]["list"][number];

interface ItemProps {
  item: Experience;
}

const Item = ({ item }: ItemProps) => {
  const endDate = item.onGoing ? "Present" : formatDate(item.endDate);
  return (
    <>
      <div className="mt-8 flex flex-col text-center md:flex-row md:text-left">
        <div className="md:w-2/5">
          <div className="flex justify-center md:justify-start">
            <span className="shrink-0">
              <Image
                src={item.logoUrl}
                className="h-12 max-w-full"
                alt={item.title}
                loading="lazy"
                width={120}
                height={48}
              />
            </span>
            <div className="relative ml-3 hidden w-full md:block">
              <span className="absolute inset-x-0 top-[35%] h-0.5 -translate-y-1/2 transform bg-gray-300 dark:bg-gray-700" />
            </div>
          </div>
        </div>
        <div className="md:w-3/5">
          <div className="relative flex justify-center md:justify-start md:pl-16">
            <span className="absolute left-8 top-2 hidden h-4 w-4 rounded-full border-2 border-gray-500 bg-white md:block" />

            <div className="mt-1 flex">
              <div className="hidden text-indigo-700 md:block">
                <ChevronRightIcon className="h-6 w-6" />
              </div>
              <div className="flex-1 md:-mt-1 md:pl-8">
                <span className="block text-slate-500 dark:text-slate-400">
                  {formatDate(item.startDate)} - {endDate}
                </span>
                <span className="block pt-2 text-xl uppercase text-indigo-700 dark:text-indigo-500">
                  {item.title}
                </span>
                {item.website ? (
                  <a
                    href={item.website}
                    target="_blank"
                    className="block pt-2 uppercase text-slate-600 dark:text-slate-300"
                  >
                    {item.organization}
                  </a>
                ) : (
                  <span className="block pt-2 uppercase text-slate-600 dark:text-slate-300">
                    {item.organization}
                  </span>
                )}
                {item.description && (
                  <div className="pt-2">
                    <span className="font-body block text-black dark:text-slate-300">
                      {item.description}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const List = () => {
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
          <Item key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
};

export default function Page() {
  return (
    <>
      <Head title="Experience" />
      <div className="container mx-auto px-8 py-16 md:py-20">
        <h2 className="font-header text-center text-4xl font-semibold uppercase text-indigo-700 sm:text-5xl lg:text-6xl">
          My experience
        </h2>
        <h3 className="font-header pt-6 text-center text-xl font-medium text-black dark:text-slate-200 sm:text-2xl lg:text-3xl">
          Here&rsquo;s what I did before
        </h3>

        <List />
      </div>
    </>
  );
}
