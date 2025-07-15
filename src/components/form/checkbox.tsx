import { Checkbox } from "../ui/checkbox";

interface FormCheckboxProps {
  field: {
    name: string;
    state: { value: boolean };
    handleBlur: () => void;
    handleChange: (value: boolean) => void;
  };
  label: string;
  description?: string;
  className?: string;
}

export function FormCheckbox({
  field,
  label,
  description,
  className,
}: FormCheckboxProps) {
  return (
    <div
      className={`flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 ${className}`}
    >
      <Checkbox
        id={field.name}
        name={field.name}
        checked={field.state.value}
        onBlur={field.handleBlur}
        onCheckedChange={(checked: boolean) => field.handleChange(checked)}
      />
      <div className="space-y-1 leading-none">
        <label
          htmlFor={field.name}
          className="font-medium text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          {label}
        </label>
        {description && (
          <p className="text-muted-foreground text-sm">{description}</p>
        )}
      </div>
    </div>
  );
}
