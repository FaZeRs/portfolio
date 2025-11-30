import { ExperienceType } from "@acme/types";
import { formatDate } from "@acme/utils";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useTRPC } from "~/lib/trpc";
import { LazyImage } from "../lazy-image";
import SectionHeading from "../section-heading";

type ExperienceItemProps = {
  experience: ExperienceType;
};

function ExperienceItem({ experience }: Readonly<ExperienceItemProps>) {
  const { title, institution, startDate, endDate, description, url, imageUrl } =
    experience;

  return (
    <div className="relative flex max-w-2xl items-start gap-x-4 before:absolute before:top-[5rem] before:bottom-0 before:left-9 before:h-[calc(100%-70px)] before:w-[1px] before:bg-zinc-200 lg:gap-x-6 dark:before:bg-zinc-800">
      {imageUrl && url ? (
        <a
          className="relative grid min-h-[80px] min-w-[80px] place-items-center overflow-clip rounded-md border border-zinc-200 bg-secondary-bg p-2 dark:border-zinc-800 dark:bg-primary-bg"
          href={url}
          rel="noreferrer noopener"
          target="_blank"
        >
          <LazyImage
            alt={title}
            className="h-14 w-14"
            height={50}
            imageClassName="object-cover duration-300"
            sizes="50px"
            src={imageUrl}
            width={50}
          />
        </a>
      ) : (
        imageUrl && (
          <div className="relative grid min-h-[80px] min-w-[80px] place-items-center overflow-clip rounded-md border border-zinc-200 bg-secondary-bg p-2 dark:border-zinc-800 dark:bg-primary-bg">
            <LazyImage
              alt={title}
              className="h-14 w-14"
              height={50}
              imageClassName="object-cover duration-300"
              sizes="50px"
              src={imageUrl}
              width={50}
            />
          </div>
        )
      )}

      <div className="flex flex-col items-start">
        <h3 className="font-semibold text-xl">{institution}</h3>
        <p>{title}</p>

        <time className="mt-2 text-sm text-zinc-500 uppercase tracking-widest">
          {startDate && formatDate(startDate)} -{" "}
          {endDate ? (
            formatDate(endDate)
          ) : (
            <span className="text-tertiary-color dark:text-primary-color">
              Present
            </span>
          )}
        </time>

        <p className="my-4 text-zinc-600 tracking-tight dark:text-zinc-400">
          {description}
        </p>
      </div>
    </div>
  );
}

const ExperienceSection = () => {
  const trpc = useTRPC();
  const { data: experiences } = useSuspenseQuery(
    trpc.experience.allPublic.queryOptions()
  );

  return (
    <div>
      <SectionHeading>Work experience</SectionHeading>

      <div className="grid grid-cols-1 gap-x-12 gap-y-10 lg:grid-cols-2">
        {experiences.map((experience) => (
          <ExperienceItem experience={experience} key={experience.id} />
        ))}
      </div>
    </div>
  );
};

export default ExperienceSection;
