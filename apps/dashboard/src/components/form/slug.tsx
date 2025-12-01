import { Input } from "@acme/ui/input";

type FormSlugProps = {
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
};

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
        className="font-medium text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        htmlFor={field.name}
      >
        {label}
      </label>
      <Input
        aria-describedby="slug-desc"
        aria-required="true"
        id={field.name}
        name={field.name}
        onBlur={field.handleBlur}
        onChange={(e) => field.handleChange(e.target.value)}
        placeholder={placeholder}
        type="text"
        value={field.state.value}
      />
      <p className="text-muted-foreground text-xs" id="slug-desc">
        Used in the URL: {urlPath}
      </p>
    </div>
  );
}
