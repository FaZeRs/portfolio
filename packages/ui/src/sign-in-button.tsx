import { cn } from "@acme/ui";
import { ComponentProps } from "react";
import { SimpleIcon } from "simple-icons";
import { Button } from "./button";
import Icon from "./icon";

interface SignInButtonProps extends ComponentProps<typeof Button> {
  label: string;
  icon: SimpleIcon;
  onClick: () => void;
}

export default function SignInButton({
  label,
  icon,
  className,
  onClick,
  ...props
}: Readonly<SignInButtonProps>) {
  return (
    <Button
      className={cn(
        "flex w-full items-center justify-center gap-2 text-white hover:text-white",
        className
      )}
      onClick={onClick}
      size="lg"
      type="button"
      variant="outline"
      {...props}
    >
      <Icon className="h-5 w-5" icon={icon} />
      <span>Sign in with {label}</span>
    </Button>
  );
}
