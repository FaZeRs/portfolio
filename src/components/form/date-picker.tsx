import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "~/lib/utils";
import { Button } from "../ui/button";
import { Calendar } from "../ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

interface FormDatePickerProps {
  field: {
    name: string;
    state: { value: string };
    handleChange: (value: string) => void;
  };
  label: string;
  placeholder: string;
  disabled?: boolean;
  className?: string;
}

export function FormDatePicker({
  field,
  label,
  placeholder,
  disabled = false,
  className,
}: FormDatePickerProps) {
  return (
    <div className={className}>
      <label
        htmlFor={field.name}
        className="font-medium text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        {label}
      </label>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn(
              "justify-start text-left font-normal",
              !field.state.value && "text-muted-foreground",
              disabled && "cursor-not-allowed opacity-50",
            )}
            disabled={disabled}
          >
            <CalendarIcon />
            {field.state.value ? (
              format(new Date(field.state.value), "PPP")
            ) : (
              <span>{placeholder}</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            captionLayout="dropdown-buttons"
            selected={
              field.state.value ? new Date(field.state.value) : undefined
            }
            onSelect={(value) => {
              if (value) {
                field.handleChange(value.toISOString());
              }
            }}
            initialFocus
            fromYear={2010}
            toYear={2030}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
