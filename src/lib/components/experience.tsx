import { experiencesData } from "~/lib/constants/experiences-data";
import { formatDate } from "~/lib/utils";
import SectionHeading from "./section-heading";

interface ExperienceItemProps {
  experience: {
    title: string;
    name: string;
    startDate: string;
    endDate?: string;
    description: string;
    url: string;
    logo: string;
  };
}

function ExperienceItem({ experience }: Readonly<ExperienceItemProps>) {
  const { title, name, startDate, endDate, description, url, logo } = experience;

  return (
    <div className="relative flex max-w-2xl items-start gap-x-4 lg:gap-x-6">
      <a
        href={url}
        rel="noreferrer noopener"
        target="_blank"
        className="dark:bg-primary-bg bg-secondary-bg relative grid min-h-[80px] min-w-[80px] place-items-center overflow-clip rounded-md border border-zinc-200 p-2 dark:border-zinc-800"
      >
        <img
          src={logo}
          className="object-cover duration-300"
          alt={title}
          width={50}
          height={50}
        />
      </a>

      <div className="flex flex-col items-start">
        <h3 className="text-xl font-semibold">{name}</h3>
        <p>{title}</p>

        <time className="mt-2 text-sm uppercase tracking-widest text-zinc-500">
          {formatDate(startDate)} -{" "}
          {endDate ? (
            formatDate(endDate)
          ) : (
            <span className="dark:text-primary-color text-tertiary-color">Present</span>
          )}
        </time>

        <p className="my-4 tracking-tight text-zinc-600 dark:text-zinc-400">
          {description}
        </p>
      </div>
    </div>
  );
}

const ExperienceSection = () => {
  return (
    <div>
      <SectionHeading>Work experience</SectionHeading>

      <div className="grid grid-cols-1 gap-x-12 gap-y-10 lg:grid-cols-2">
        {experiencesData.map((experience, i) => (
          <ExperienceItem key={i} experience={experience} />
        ))}
      </div>
    </div>
  );
};

export default ExperienceSection;
