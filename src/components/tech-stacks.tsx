import Icon from "~/components/ui/icon";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";

import { STACKS } from "~/lib/constants/stack";

type StackProps = {
  techStack: string[] | null;
};

export default function TechStacks({ techStack }: Readonly<StackProps>) {
  return (
    <div className="flex items-center gap-3">
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
