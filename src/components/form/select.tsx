import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

type FormSelectProps<T = string> = {
  field: {
    name: string;
    state: { value: T };
    handleBlur: () => void;
    handleChange: (value: T) => void;
    FormItem: React.ComponentType<{
      className?: string;
      children: React.ReactNode;
    }>;
    FormLabel: React.ComponentType<{ children: React.ReactNode }>;
    FormControl: React.ComponentType<{ children: React.ReactNode }>;
    FormMessage: React.ComponentType;
  };
  label: string;
  placeholder: string;
  options: { value: string; label: string }[];
  className?: string;
};

export function FormSelect<T = string>({
  field,
  label,
  placeholder,
  options,
  className,
}: Readonly<FormSelectProps<T>>) {
  return (
    <field.FormItem className={className}>
      <field.FormLabel>{label}</field.FormLabel>
      <field.FormControl>
        <Select
          name={field.name}
          onValueChange={(value) => field.handleChange(value as T)}
          value={String(field.state.value)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </field.FormControl>
      <field.FormMessage />
    </field.FormItem>
  );
}
