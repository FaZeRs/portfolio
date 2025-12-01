import { cn } from "@acme/ui";
import { Button } from "@acme/ui/button";
import { Calendar } from "@acme/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@acme/ui/popover";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

type FormDatePickerProps = {
  field: {
    name: string;
    state: { value: string };
    handleChange: (value: string) => void;
  };
  label: string;
  placeholder: string;
  disabled?: boolean;
  className?: string;
};

export function FormDatePicker({
  field,
  label,
  placeholder,
  disabled = false,
  className,
}: Readonly<FormDatePickerProps>) {
  return (
    <div className={className}>
      <label
        className="font-medium text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        htmlFor={field.name}
      >
        {label}
      </label>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            className={cn(
              "justify-start text-left font-normal",
              !field.state.value && "text-muted-foreground",
              disabled && "cursor-not-allowed opacity-50"
            )}
            disabled={disabled}
            variant={"outline"}
          >
            <CalendarIcon />
            {field.state.value ? (
              format(new Date(field.state.value), "PPP")
            ) : (
              <span>{placeholder}</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-auto p-0">
          <Calendar
            autoFocus
            captionLayout="dropdown"
            endMonth={new Date(2030, 0)}
            mode="single"
            onSelect={(value) => {
              if (value) {
                field.handleChange(value.toISOString());
              }
            }}
            selected={
              field.state.value ? new Date(field.state.value) : undefined
            }
            startMonth={new Date(2010, 0)}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
