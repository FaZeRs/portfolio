import Icon from "~/lib/components/ui/icon";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/lib/components/ui/tooltip";

import { STACKS } from "~/lib/constants/stack";
import type { Stack } from "~/types/project";

interface StackProps {
  projectStack: Stack[];
}

export default function ProjectStacks({ projectStack }: Readonly<StackProps>) {
  return (
    <div className="flex items-center gap-3">
      {projectStack.map((stack) => (
        <TooltipProvider key={stack.name} delayDuration={200}>
          <Tooltip>
            <TooltipTrigger>
              {STACKS[stack.name] && (
                <Icon icon={STACKS[stack.name]} className="mr-2 h-4 w-4" />
              )}
            </TooltipTrigger>
            <TooltipContent>{stack.name}</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ))}
    </div>
  );
}
