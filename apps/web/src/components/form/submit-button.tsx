import { Button } from "@acme/ui/button";

type FormSubmitButtonProps = {
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
};

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
