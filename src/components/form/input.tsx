import { Input } from "../ui/input";

interface FormInputProps {
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
  type?: "text" | "email" | "url" | "password";
  required?: boolean;
  description?: string;
  className?: string;
}

export function FormInput({
  field,
  label,
  placeholder,
  type = "text",
  required = false,
  description,
  className,
}: Readonly<FormInputProps>) {
  return (
    <field.FormItem className={className}>
      <field.FormLabel>{label}</field.FormLabel>
      <field.FormControl>
        <Input
          id={field.name}
          name={field.name}
          type={type}
          placeholder={placeholder}
          value={field.state.value}
          onBlur={field.handleBlur}
          onChange={(e) => field.handleChange(e.target.value)}
          aria-required={required}
          aria-describedby={description ? `${field.name}-desc` : undefined}
        />
      </field.FormControl>
      {description && (
        <p id={`${field.name}-desc`} className="text-muted-foreground text-xs">
          {description}
        </p>
      )}
      <field.FormMessage />
    </field.FormItem>
  );
}
