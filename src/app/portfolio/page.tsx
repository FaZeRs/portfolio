"use client";

import Image from "next/image";
import Head from "~/app/_components/head";
import { Spinner } from "~/app/_components/spinner";
import { api } from "~/trpc/react";
import { RouterOutputs } from "~/trpc/shared";

type Project = RouterOutputs["project"]["list"][number];

interface ItemProps {
  item: Project;
}

const Item = ({ item }: ItemProps) => {
  const thumbnail =
    item.thumbnailUrl ??
    `https://placehold.co/1000x750.png?text=${item.title}&font=roboto`;
  return (
    <div className="mx-auto transform cursor-pointer transition-all hover:scale-105 md:mx-0">
      <Image
        src={thumbnail}
        className="aspect-video h-min w-full object-cover shadow"
        alt={item.title}
        width="1000"
        height="750"
      />
    </div>
  );
};

const List = () => {
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
        <Item key={item.id} item={item} />
      ))}
    </div>
  );
};

export default function Page() {
  return (
    <>
      <Head title="Portfolio" />
      <div id="portfolio" className="container mx-auto px-8 py-16 md:py-20">
        <h2 className="text-center text-4xl font-semibold uppercase text-indigo-700 sm:text-5xl lg:text-6xl">
          Check out my Portfolio
        </h2>
        <h3 className="pt-6 text-center text-xl font-medium text-black dark:text-slate-200 sm:text-2xl lg:text-3xl">
          Here's what I have done with the past
        </h3>

        <List />
      </div>
    </>
  );
}
