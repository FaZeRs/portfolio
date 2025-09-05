"use client";

import type { ComponentProps } from "react";
import { Button } from "~/components/ui/button";
import { ScrollArea, ScrollBar } from "~/components/ui/scroll-area";
import { cn } from "~/lib/utils";

export type SuggestionsProps = ComponentProps<typeof ScrollArea>;

export const Suggestions = ({
  className,
  children,
  ...props
}: SuggestionsProps) => (
  <ScrollArea
    className="w-full overflow-x-auto whitespace-nowrap pb-2"
    {...props}
  >
    <div className={cn("flex w-max flex-nowrap items-center gap-3", className)}>
      {children}
    </div>
    <ScrollBar
      className="h-1.5 rounded-full bg-background/50"
      orientation="horizontal"
    />
  </ScrollArea>
);

export type SuggestionProps = Omit<ComponentProps<typeof Button>, "onClick"> & {
  suggestion: string;
  onClick?: (suggestion: string) => void;
};

export const Suggestion = ({
  suggestion,
  onClick,
  className,
  variant = "secondary",
  size = "sm",
  children,
  ...props
}: SuggestionProps) => {
  const handleClick = () => {
    onClick?.(suggestion);
  };

  return (
    <Button
      className={cn(
        "cursor-pointer whitespace-nowrap rounded-full border border-border/50 bg-background/80 px-4 py-2 font-medium text-sm shadow-sm backdrop-blur-sm transition-all duration-200",
        "hover:border-primary/30 hover:bg-primary/5 hover:text-primary hover:shadow-md",
        "focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20",
        className
      )}
      onClick={handleClick}
      size={size}
      type="button"
      variant={variant}
      {...props}
    >
      {children || suggestion}
    </Button>
  );
};
