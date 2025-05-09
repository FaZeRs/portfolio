import Icon from "~/lib/components/ui/icon";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/lib/components/ui/tooltip";

import { STACKS } from "~/lib/constants/stack";

interface StackProps {
  projectStack: string[] | null;
}

export default function ProjectStacks({ projectStack }: Readonly<StackProps>) {
  return (
    <div className="flex items-center gap-3">
      {projectStack?.map((stack) => (
        <TooltipProvider key={stack} delayDuration={200}>
          <Tooltip>
            <TooltipTrigger>
              {STACKS[stack] && (
                <Icon icon={STACKS[stack]} className="mr-2 h-4 w-4" />
              )}
            </TooltipTrigger>
            <TooltipContent>{stack}</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ))}
    </div>
  );
}
