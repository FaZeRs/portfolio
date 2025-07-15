import { Textarea } from "../ui/textarea";

interface FormTextareaProps {
  field: {
    name: string;
    state: { value: string };
    handleBlur: () => void;
    handleChange: (value: string) => void;
    FormItem: React.ComponentType<{
      className?: string;
      children: React.ReactNode;
    }>;
    FormLabel: React.ComponentType<{ children: React.ReactNode }>;
    FormControl: React.ComponentType<{ children: React.ReactNode }>;
    FormMessage: React.ComponentType;
  };
  label: string;
  placeholder?: string;
  className?: string;
  minHeight?: string;
}

export function FormTextarea({
  field,
  label,
  placeholder,
  className,
  minHeight = "min-h-[80px]",
}: FormTextareaProps) {
  return (
    <field.FormItem className={className}>
      <field.FormLabel>{label}</field.FormLabel>
      <field.FormControl>
        <Textarea
          id={field.name}
          name={field.name}
          placeholder={placeholder}
          value={field.state.value}
          onBlur={field.handleBlur}
          onChange={(e) => field.handleChange(e.target.value)}
          className={minHeight}
        />
      </field.FormControl>
      <field.FormMessage />
    </field.FormItem>
  );
}
