import Image from "next/image";
import { ChevronRightIcon } from "@heroicons/react/24/solid";
import type { RouterOutputs } from "~/trpc/shared";
import { formatDate } from "~/utils/format-date";

type Experience = RouterOutputs["experience"]["list"][number];

interface ExperienceItemProps {
  item: Experience;
}

const ExperienceItem = ({ item }: ExperienceItemProps) => {
  let endDate = "Present";
  if (item.onGoing === false && item.endDate !== null) {
    endDate = formatDate(item.endDate);
  }
  return (
    <>
      <div className="mt-8 flex flex-col text-center md:flex-row md:text-left">
        <div className="md:w-2/5">
          <div className="flex justify-center md:justify-start">
            <span className="shrink-0">
              {item.logoUrl && (
                <Image
                  src={item.logoUrl}
                  className="h-12 max-w-full"
                  alt={item.title}
                  loading="lazy"
                  width={120}
                  height={48}
                />
              )}
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

export default ExperienceItem;
