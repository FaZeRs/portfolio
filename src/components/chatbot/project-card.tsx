import { Link } from "@tanstack/react-router";
import { PinIcon } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { TagList } from "~/components/ui/tag-list";
import { ToolProject } from "~/lib/ai";

export function ProjectCard({ project }: Readonly<{ project: ToolProject }>) {
  const { title, description, stacks, slug, isFeatured } = project;

  return (
    <Card className="group relative overflow-hidden transition-all hover:shadow-md">
      {isFeatured && (
        <div className="absolute top-0 right-0 z-[2] flex items-center gap-1 rounded-tr-lg rounded-bl-lg bg-lime-300 px-1.5 py-0.5 font-medium text-[11px] text-emerald-950">
          <PinIcon size={12} />
          <span>Featured</span>
        </div>
      )}

      <Link
        className="block transition-opacity hover:opacity-80"
        params={{ projectId: slug }}
        to="/projects/$projectId"
      >
        <CardHeader className="pt-3 pb-2">
          <CardTitle className="line-clamp-1 font-bold text-base text-neutral-900 dark:text-neutral-200">
            {title}
          </CardTitle>
          {description && (
            <CardDescription className="line-clamp-2 text-xs">
              {description}
            </CardDescription>
          )}
        </CardHeader>

        <CardContent className="pt-0 pb-3">
          <TagList className="mb-3" items={stacks || []} />
        </CardContent>
      </Link>
    </Card>
  );
}

export default ProjectCard;
