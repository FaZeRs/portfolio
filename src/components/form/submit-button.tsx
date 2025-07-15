import { Button } from "../ui/button";

interface FormSubmitButtonProps {
  canSubmit: boolean;
  isPending: boolean;
  isSubmitting: boolean;
  defaultText?: string;
  loadingText?: string;
  processingText?: string;
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
}

export function FormSubmitButton({
  canSubmit,
  isPending,
  isSubmitting,
  defaultText = "Submit",
  loadingText = "Submitting...",
  processingText = "Processing...",
  variant = "default",
  size = "default",
  className = "w-full md:w-auto",
}: FormSubmitButtonProps) {
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
