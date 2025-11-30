import { MultiSelect } from "@acme/ui/multi-select";

type FormMultiSelectProps = {
  field: {
    name: string;
    state: { value: string[] };
    handleChange: (value: string[]) => void;
  };
  label: string;
  placeholder: string;
  options: { label: string; value: string; icon?: React.ReactNode }[];
  className?: string;
};

export function FormMultiSelect({
  field,
  label,
  placeholder,
  options,
  className,
}: Readonly<FormMultiSelectProps>) {
  return (
    <div className={className}>
      <label
        className="font-medium text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        htmlFor={field.name}
      >
        {label}
      </label>
      <MultiSelect
        defaultValue={field.state.value}
        onValueChange={(value) => field.handleChange(value)}
        options={options}
        placeholder={placeholder}
      />
    </div>
  );
}
