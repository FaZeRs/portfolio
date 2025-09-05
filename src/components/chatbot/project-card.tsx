import { Link } from "@tanstack/react-router";
import { PinIcon } from "lucide-react";
import { Badge } from "~/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { ToolProject } from "~/lib/ai";

const MAX_STACKS_DISPLAY = 2;

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
          {stacks && stacks.length > 0 && (
            <div className="mb-3 flex flex-wrap gap-1">
              {stacks.slice(0, MAX_STACKS_DISPLAY).map((stack) => (
                <Badge className="text-[10px]" key={stack} variant="secondary">
                  {stack}
                </Badge>
              ))}
              {stacks.length > MAX_STACKS_DISPLAY && (
                <Badge className="text-[10px]" variant="outline">
                  +{stacks.length - MAX_STACKS_DISPLAY}
                </Badge>
              )}
            </div>
          )}
        </CardContent>
      </Link>
    </Card>
  );
}
