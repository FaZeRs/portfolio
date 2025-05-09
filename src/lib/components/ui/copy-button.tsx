import { Check, Copy } from "lucide-react";
import type { HTMLAttributes } from "react";
import { useCopyToClipboard } from "react-use";

import { cn } from "~/lib/utils";

import { Button } from "./button";

interface CopyButtonProps extends HTMLAttributes<HTMLButtonElement> {
  value: string;
  withMeta?: boolean;
}

const CopyButton = ({
  className,
  value,
  withMeta = false,
  ...props
}: CopyButtonProps) => {
  const [state, copyToClipboard] = useCopyToClipboard();

  return (
    <div className={cn("absolute top-1 right-2", withMeta && "top-16")}>
      <Button
        {...props}
        size="icon"
        variant="ghost"
        className={cn("relative z-10 size-7", className)}
        onClick={() => copyToClipboard(value)}
      >
        <span className="sr-only">Copy</span>
        {state.value ? (
          <Check className="size-4" />
        ) : (
          <Copy className="size-4" />
        )}
      </Button>
    </div>
  );
};

export default CopyButton;
