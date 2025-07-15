import { MultiSelect } from "../ui/multi-select";

interface FormMultiSelectProps {
  field: {
    name: string;
    state: { value: string[] };
    handleChange: (value: string[]) => void;
  };
  label: string;
  placeholder: string;
  options: { label: string; value: string; icon?: React.ReactNode }[];
  className?: string;
}

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
        htmlFor={field.name}
        className="font-medium text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        {label}
      </label>
      <MultiSelect
        options={options}
        onValueChange={(value) => field.handleChange(value)}
        defaultValue={field.state.value}
        placeholder={placeholder}
      />
    </div>
  );
}
