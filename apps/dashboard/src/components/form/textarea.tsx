import { Textarea } from "@acme/ui/textarea";

interface FormTextareaProps {
  className?: string;
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
  minHeight?: string;
  placeholder?: string;
}

export function FormTextarea({
  field,
  label,
  placeholder,
  className,
  minHeight = "min-h-[80px]",
}: Readonly<FormTextareaProps>) {
  return (
    <field.FormItem className={className}>
      <field.FormLabel>{label}</field.FormLabel>
      <field.FormControl>
        <Textarea
          className={minHeight}
          id={field.name}
          name={field.name}
          onBlur={field.handleBlur}
          onChange={(e) => field.handleChange(e.target.value)}
          placeholder={placeholder}
          value={field.state.value}
        />
      </field.FormControl>
      <field.FormMessage />
    </field.FormItem>
  );
}
