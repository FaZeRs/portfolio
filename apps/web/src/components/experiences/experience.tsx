import { ExperienceType } from "@acme/types";
import { LazyImage } from "@acme/ui/lazy-image";
import { formatDate } from "@acme/utils";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useTRPC } from "~/lib/trpc";

type ExperienceItemProps = {
  experience: ExperienceType;
};

function ExperienceItem({ experience }: Readonly<ExperienceItemProps>) {
  const { title, institution, startDate, endDate, description, url, imageUrl } =
    experience;

  return (
    <div className="group relative flex items-start gap-4 rounded-xl border bg-card p-5 transition-all hover:border-foreground/20 hover:shadow-lg lg:gap-5">
      {/* Timeline dot */}
      <div className="absolute top-0 left-6 h-full w-px bg-gradient-to-b from-primary/50 via-primary/20 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />

      {imageUrl ? (
        url ? (
          <a
            className="relative shrink-0 overflow-hidden rounded-lg border bg-muted/50 p-2 transition-all hover:border-primary/30 hover:shadow-md"
            href={url}
            rel="noreferrer noopener"
            target="_blank"
          >
            <LazyImage
              alt={title}
              height={56}
              imageClassName="h-12 w-12 object-contain"
              src={imageUrl}
              width={56}
            />
          </a>
        ) : (
          <div className="relative shrink-0 overflow-hidden rounded-lg border bg-muted/50 p-2">
            <LazyImage
              alt={title}
              height={56}
              imageClassName="h-12 w-12 object-contain"
              src={imageUrl}
              width={56}
            />
          </div>
        )
      ) : null}

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <h3 className="font-semibold text-lg leading-tight">{institution}</h3>
          <time className="shrink-0 text-muted-foreground text-sm">
            {startDate && formatDate(startDate)} –{" "}
            {endDate ? (
              formatDate(endDate)
            ) : (
              <span className="font-medium text-emerald-600 dark:text-emerald-400">
                Present
              </span>
            )}
          </time>
        </div>

        <p className="mt-0.5 font-medium text-muted-foreground text-sm">
          {title}
        </p>

        {description && (
          <p className="mt-3 text-muted-foreground text-sm leading-relaxed">
            {description}
          </p>
        )}
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
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      {experiences.map((experience) => (
        <ExperienceItem experience={experience} key={experience.id} />
      ))}
    </div>
  );
};

export default ExperienceSection;
