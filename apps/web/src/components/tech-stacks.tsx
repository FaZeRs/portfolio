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
    <div className="flex flex-wrap items-center gap-3">
      {techStack?.map((stack) => (
        <TooltipProvider delayDuration={200} key={stack}>
          <Tooltip>
            <TooltipTrigger>
              {STACKS[stack] && (
                <Icon className="mr-2 h-4 w-4" icon={STACKS[stack]} />
              )}
            </TooltipTrigger>
            <TooltipContent>{stack}</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ))}
    </div>
  );
}
