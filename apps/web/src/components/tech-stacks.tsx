import { STACKS } from "@acme/shared/stack";
import Icon from "@acme/ui/icon";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@acme/ui/tooltip";

type StackProps = {
  techStack: string[] | null;
};

export default function TechStacks({ techStack }: Readonly<StackProps>) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {techStack?.map((stack) => (
        <TooltipProvider delayDuration={200} key={stack}>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg border bg-background transition-colors hover:border-foreground/20 hover:bg-muted">
                {STACKS[stack] && (
                  <Icon className="h-4 w-4" icon={STACKS[stack]} />
                )}
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <span className="font-medium">{stack}</span>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ))}
    </div>
  );
}
