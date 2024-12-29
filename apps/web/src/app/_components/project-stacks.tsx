import Icon from "@acme/ui/icon";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@acme/ui/tooltip";

import type { Stack } from "~/types/project";
import { STACKS } from "~/constants/stack";

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
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                <Icon icon={STACKS[stack.name]!} className="mr-2 h-4 w-4" />
              )}
            </TooltipTrigger>
            <TooltipContent>{stack.name}</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ))}
    </div>
  );
}
