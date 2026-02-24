import { Button } from "@acme/ui/button";

interface FormSubmitButtonProps {
  canSubmit: boolean;
  className?: string;
  defaultText?: string;
  isPending: boolean;
  isSubmitting: boolean;
  loadingText?: string;
  processingText?: string;
  size?: "default" | "sm" | "lg" | "icon";
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
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
}: Readonly<FormSubmitButtonProps>) {
  const buttonText = (() => {
    if (isSubmitting) {
      return loadingText;
    }

    if (isPending) {
      return processingText;
    }

    return defaultText;
  })();

  return (
    <Button
      className={className}
      disabled={!canSubmit || isPending || isSubmitting}
      size={size}
      type="submit"
      variant={variant}
    >
      {buttonText}
    </Button>
  );
}
