import { Button } from "./ui/button";

interface FormButtonProps {
  canSubmit: boolean;
  isPending: boolean;
  isSubmitting: boolean;
  loadingText?: string;
  processingText?: string;
  defaultText?: string;
  className?: string;
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  size?: "default" | "sm" | "lg" | "icon";
}

export function FormButton({
  canSubmit,
  isPending,
  isSubmitting,
  loadingText = "Submitting...",
  processingText = "Processing...",
  defaultText = "Submit",
  className = "w-full md:w-auto",
  variant = "default",
  size,
}: Readonly<FormButtonProps>) {
  const buttonText = isSubmitting
    ? loadingText
    : isPending
      ? processingText
      : defaultText;

  return (
    <Button
      type="submit"
      variant={variant}
      size={size}
      disabled={!canSubmit || isPending || isSubmitting}
      className={className}
    >
      {buttonText}
    </Button>
  );
}
