import { Checkbox } from "@acme/ui/checkbox";

interface FormCheckboxProps {
  className?: string;
  description?: string;
  field: {
    name: string;
    state: { value: boolean };
    handleBlur: () => void;
    handleChange: (value: boolean) => void;
  };
  label: string;
}

export function FormCheckbox({
  field,
  label,
  description,
  className,
}: Readonly<FormCheckboxProps>) {
  return (
    <div
      className={`flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 ${className}`}
    >
      <Checkbox
        checked={field.state.value}
        id={field.name}
        name={field.name}
        onBlur={field.handleBlur}
        onCheckedChange={(checked: boolean) => field.handleChange(checked)}
      />
      <div className="space-y-1 leading-none">
        <label
          className="font-medium text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          htmlFor={field.name}
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
