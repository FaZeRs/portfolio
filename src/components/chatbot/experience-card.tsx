import { BuildingIcon } from "lucide-react";
import { Badge } from "~/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { ToolExperience } from "~/lib/ai";

export function ExperienceCard({ experience }: { experience: ToolExperience }) {
  const { title, description, institution, type, isOnGoing } = experience;

  return (
    <Card className="group relative overflow-hidden transition-all hover:shadow-md">
      <CardHeader className="pt-3 pb-2">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <CardTitle className="font-semibold text-base text-neutral-900 dark:text-neutral-200">
              {title}
            </CardTitle>
            {institution && (
              <CardDescription className="mt-1 flex items-center gap-1 font-medium text-muted-foreground text-sm">
                <BuildingIcon size={14} />
                {institution}
              </CardDescription>
            )}
          </div>
          <div className="flex flex-col items-end gap-1">
            {type && (
              <Badge className="shrink-0 text-[10px]" variant="outline">
                {type}
              </Badge>
            )}
            {isOnGoing && (
              <Badge className="ml-2 text-[10px]" variant="secondary">
                Current
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0 pb-3">
        {description && (
          <p className="mb-3 line-clamp-2 text-muted-foreground text-xs">
            {description}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
