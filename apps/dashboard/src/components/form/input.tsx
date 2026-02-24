import { Input } from "@acme/ui/input";

interface FormInputProps {
  className?: string;
  description?: string;
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
  required?: boolean;
  type?: "text" | "email" | "url" | "password";
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
          aria-describedby={description ? `${field.name}-desc` : undefined}
          aria-required={required}
          id={field.name}
          name={field.name}
          onBlur={field.handleBlur}
          onChange={(e) => field.handleChange(e.target.value)}
          placeholder={placeholder}
          type={type}
          value={field.state.value}
        />
      </field.FormControl>
      {description && (
        <p className="text-muted-foreground text-xs" id={`${field.name}-desc`}>
          {description}
        </p>
      )}
      <field.FormMessage />
    </field.FormItem>
  );
}
