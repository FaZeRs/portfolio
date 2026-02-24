import { cn } from "@acme/ui";
import { cva, type VariantProps } from "class-variance-authority";
import { CheckIcon, ChevronDown, WandSparkles, X, XCircle } from "lucide-react";
import { ComponentProps, useOptimistic, useState } from "react";
import { Badge } from "./badge";
import { Button } from "./button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "./command";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { Separator } from "./separator";

/**
 * Variants for the multi-select component to handle different styles.
 * Uses class-variance-authority (cva) to define different styles based on "variant" prop.
 */
const multiSelectVariants = cva(
  "m-1 transition delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:scale-110",
  {
    variants: {
      variant: {
        default:
          "border-foreground/10 bg-card text-foreground hover:bg-card/80",
        secondary:
          "border-foreground/10 bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        inverted: "inverted",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

/**
 * Props for MultiSelect component
 */
interface MultiSelectProps
  extends ComponentProps<"button">,
    VariantProps<typeof multiSelectVariants> {
  /**
   * Animation duration in seconds for the visual effects (e.g., bouncing badges).
   * Optional, defaults to 0 (no animation).
   */
  animation?: number;

  /**
   * Additional class names to apply custom styles to the multi-select component.
   * Optional, can be used to add custom styles.
   */
  className?: string;

  /** The default selected values when the component mounts. */
  defaultValue?: string[];

  /**
   * Maximum number of items to display. Extra selected items will be summarized.
   * Optional, defaults to 3.
   */
  maxCount?: number;

  /**
   * The modality of the popover. When set to true, interaction with outside elements
   * will be disabled and only popover content will be visible to screen readers.
   * Optional, defaults to false.
   */
  modalPopover?: boolean;

  /**
   * Callback function triggered when the selected values change.
   * Receives an array of the new selected values.
   */
  onValueChange: (value: string[]) => void;
  /**
   * An array of option objects to be displayed in the multi-select component.
   * Each option object has a label, value, and an optional icon.
   */
  options: {
    /** The text to display for the option. */
    label: string;
    /** The unique value associated with the option. */
    value: string;
    /** Optional icon component or element to display alongside the option. */
    icon?: React.ReactNode;
  }[];

  /**
   * Placeholder text to be displayed when no values are selected.
   * Optional, defaults to "Select options".
   */
  placeholder?: string;
}

const EMPTY_ARRAY: string[] = [];

export const MultiSelect = ({
  options,
  onValueChange,
  variant,
  defaultValue = EMPTY_ARRAY,
  placeholder = "Select options",
  animation = 0,
  maxCount = 3,
  modalPopover = false,
  className,
  ref,
  ...props
}: MultiSelectProps & { ref?: React.Ref<HTMLButtonElement> }) => {
  const [selectedValues, setSelectedValues] = useState<string[]>(defaultValue);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const [optimisticSelectedValues, updateSelectedValues] = useOptimistic(
    selectedValues,
    (_, newValues: string[]) => newValues
  );

  const handleInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      setIsPopoverOpen(true);
    } else if (event.key === "Backspace" && !event.currentTarget.value) {
      const newSelectedValues = [...selectedValues];
      newSelectedValues.pop();
      updateSelectedValues(newSelectedValues);
      setSelectedValues(newSelectedValues);
      onValueChange(newSelectedValues);
    }
  };

  const toggleOption = (option: string) => {
    const newSelectedValues = selectedValues.includes(option)
      ? selectedValues.filter((value) => value !== option)
      : [...selectedValues, option];
    updateSelectedValues(newSelectedValues);
    setSelectedValues(newSelectedValues);
    onValueChange(newSelectedValues);
  };

  const handleClear = () => {
    updateSelectedValues([]);
    setSelectedValues([]);
    onValueChange([]);
  };

  const handleTogglePopover = () => {
    setIsPopoverOpen((prev) => !prev);
  };

  const clearExtraOptions = () => {
    const newSelectedValues = selectedValues.slice(0, maxCount);
    updateSelectedValues(newSelectedValues);
    setSelectedValues(newSelectedValues);
    onValueChange(newSelectedValues);
  };

  const toggleAll = () => {
    if (selectedValues.length === options.length) {
      handleClear();
    } else {
      const allValues = options.map((option) => option.value);
      updateSelectedValues(allValues);
      setSelectedValues(allValues);
      onValueChange(allValues);
    }
  };

  return (
    <Popover
      modal={modalPopover}
      onOpenChange={setIsPopoverOpen}
      open={isPopoverOpen}
    >
      <PopoverTrigger asChild>
        <Button
          ref={ref}
          {...props}
          className={cn(
            "flex h-auto min-h-10 w-full items-center justify-between rounded-md border bg-inherit p-1 hover:bg-inherit [&_svg]:pointer-events-auto",
            className
          )}
          onClick={handleTogglePopover}
        >
          {optimisticSelectedValues.length > 0 ? (
            <div className="flex w-full items-center justify-between">
              <div className="flex flex-wrap items-center">
                {optimisticSelectedValues.slice(0, maxCount).map((value) => {
                  const option = options.find((o) => o.value === value);
                  return (
                    <Badge
                      className={cn(
                        isAnimating ? "animate-bounce" : "",
                        multiSelectVariants({ variant })
                      )}
                      key={value}
                      style={{ animationDuration: `${animation}s` }}
                    >
                      {option?.icon}
                      {option?.label}
                      <XCircle
                        className="ml-2 h-4 w-4 cursor-pointer"
                        onClick={(event) => {
                          event.stopPropagation();
                          toggleOption(value);
                        }}
                      />
                    </Badge>
                  );
                })}
                {optimisticSelectedValues.length > maxCount && (
                  <Badge
                    className={cn(
                      "border-foreground/1 bg-transparent text-foreground hover:bg-transparent",
                      isAnimating ? "animate-bounce" : "",
                      multiSelectVariants({ variant })
                    )}
                    style={{ animationDuration: `${animation}s` }}
                  >
                    {`+ ${optimisticSelectedValues.length - maxCount} more`}
                    <XCircle
                      className="ml-2 h-4 w-4 cursor-pointer"
                      onClick={(event) => {
                        event.stopPropagation();
                        clearExtraOptions();
                      }}
                    />
                  </Badge>
                )}
              </div>
              <div className="flex items-center justify-between">
                <X
                  className="mx-2 h-4 cursor-pointer text-muted-foreground"
                  onClick={(event) => {
                    event.stopPropagation();
                    handleClear();
                  }}
                />
                <Separator
                  className="flex h-full min-h-6"
                  orientation="vertical"
                />
                <ChevronDown className="mx-2 h-4 cursor-pointer text-muted-foreground" />
              </div>
            </div>
          ) : (
            <div className="mx-auto flex w-full items-center justify-between">
              <span className="mx-3 text-muted-foreground text-sm">
                {placeholder}
              </span>
              <ChevronDown className="mx-2 h-4 cursor-pointer text-muted-foreground" />
            </div>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className="w-auto p-0"
        onEscapeKeyDown={() => setIsPopoverOpen(false)}
      >
        <Command>
          <CommandInput
            onKeyDown={handleInputKeyDown}
            placeholder="Search..."
          />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              <CommandItem
                className="cursor-pointer"
                key="all"
                onSelect={toggleAll}
              >
                <div
                  className={cn(
                    "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                    optimisticSelectedValues.length === options.length
                      ? "bg-primary text-primary-foreground"
                      : "opacity-50 [&_svg]:invisible"
                  )}
                >
                  <CheckIcon className="h-4 w-4" />
                </div>
                <span>(Select All)</span>
              </CommandItem>
              {options.map((option) => {
                const isSelected = optimisticSelectedValues.includes(
                  option.value
                );
                return (
                  <CommandItem
                    className="cursor-pointer"
                    key={option.value}
                    onSelect={() => toggleOption(option.value)}
                  >
                    <div
                      className={cn(
                        "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                        isSelected
                          ? "bg-primary text-primary-foreground"
                          : "opacity-50 [&_svg]:invisible"
                      )}
                    >
                      <CheckIcon className="h-4 w-4" />
                    </div>
                    {option.icon ? (
                      <span className="mr-2 flex h-4 w-4 text-muted-foreground">
                        {option.icon}
                      </span>
                    ) : null}
                    <span>{option.label}</span>
                  </CommandItem>
                );
              })}
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup>
              <div className="flex items-center justify-between">
                {optimisticSelectedValues.length > 0 && (
                  <>
                    <CommandItem
                      className="flex-1 cursor-pointer justify-center"
                      onSelect={handleClear}
                    >
                      Clear
                    </CommandItem>
                    <Separator
                      className="flex h-full min-h-6"
                      orientation="vertical"
                    />
                  </>
                )}
                <CommandItem
                  className="max-w-full flex-1 cursor-pointer justify-center"
                  onSelect={() => setIsPopoverOpen(false)}
                >
                  Close
                </CommandItem>
              </div>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
      {animation > 0 && optimisticSelectedValues.length > 0 && (
        <WandSparkles
          className={cn(
            "my-2 h-3 w-3 cursor-pointer bg-background text-foreground",
            isAnimating ? "" : "text-muted-foreground"
          )}
          onClick={() => setIsAnimating(!isAnimating)}
        />
      )}
    </Popover>
  );
};

MultiSelect.displayName = "MultiSelect";
