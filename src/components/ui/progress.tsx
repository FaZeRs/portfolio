import { Indicator, Root } from "@radix-ui/react-progress";
import { ComponentProps } from "react";

import { cn } from "~/lib/utils";

const PERCENTAGE_CALCULATION_FACTOR = 100;

function Progress({
  className,
  value,
  ...props
}: Readonly<ComponentProps<typeof Root>>) {
  return (
    <Root
      className={cn(
        "relative h-2 w-full overflow-hidden rounded-full bg-primary/20",
        className
      )}
      data-slot="progress"
      {...props}
    >
      <Indicator
        className="h-full w-full flex-1 bg-primary transition-all"
        data-slot="progress-indicator"
        style={{
          transform: `translateX(-${PERCENTAGE_CALCULATION_FACTOR - (value || 0)}%)`,
        }}
      />
    </Root>
  );
}

export { Progress };
