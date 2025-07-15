import { Input } from "../ui/input";

interface FormSlugProps {
  field: {
    name: string;
    state: { value: string };
    handleBlur: () => void;
    handleChange: (value: string) => void;
  };
  label: string;
  placeholder: string;
  urlPath: string;
  className?: string;
}

export function FormSlug({
  field,
  label,
  placeholder,
  urlPath,
  className,
}: Readonly<FormSlugProps>) {
  return (
    <div className={className}>
      <label
        htmlFor={field.name}
        className="font-medium text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        {label}
      </label>
      <Input
        id={field.name}
        name={field.name}
        type="text"
        placeholder={placeholder}
        value={field.state.value}
        onBlur={field.handleBlur}
        onChange={(e) => field.handleChange(e.target.value)}
        aria-required="true"
        aria-describedby="slug-desc"
      />
      <p id="slug-desc" className="text-muted-foreground text-xs">
        Used in the URL: {urlPath}
      </p>
    </div>
  );
}
