import { cn } from "@acme/ui";

type ComponentPreviewProps = React.HTMLAttributes<HTMLDivElement>;

const ComponentPreview = ({
  children,

  className,
  ...props
}: ComponentPreviewProps) => {
  return (
    <div
      {...props}
      className={cn("flex justify-center rounded-lg border p-8", className)}
    >
      {children}
    </div>
  );
};

export default ComponentPreview;
