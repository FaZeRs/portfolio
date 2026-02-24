import { cn } from "@acme/ui";
import {
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  Info,
  Skull,
} from "lucide-react";

const calloutVariants = {
  default: {
    icon: Info,
    title: "Note",
    styles: "bg-teal-100 text-teal-950 dark:bg-teal-950 dark:text-teal-50",
  },
  info: {
    icon: Info,
    title: "Info",
    styles: "bg-blue-100 text-blue-950 dark:bg-blue-950 dark:text-blue-50",
  },
  success: {
    icon: CheckCircle2,
    title: "Success",
    styles: "bg-green-100 text-green-950 dark:bg-green-950 dark:text-green-50",
  },
  warning: {
    icon: AlertTriangle,
    title: "Warning",
    styles:
      "bg-yellow-100 text-yellow-950 dark:bg-yellow-950 dark:text-yellow-50",
  },
  danger: {
    icon: Skull,
    title: "Danger",
    styles: "bg-red-100 text-red-950 dark:bg-red-950 dark:text-red-50",
  },
  error: {
    icon: AlertCircle,
    title: "Error",
    styles: "bg-red-100 text-red-950 dark:bg-red-950 dark:text-red-50",
  },
};

type CalloutVariant = keyof typeof calloutVariants;

interface CalloutProps {
  children?: React.ReactNode;
  variant?: CalloutVariant;
}

export default function Callout({
  children,
  variant = "default",
  ...props
}: Readonly<CalloutProps>) {
  const { icon: Icon, styles, title } = calloutVariants[variant];
  return (
    <div
      className={cn("not-prose my-3 mt-4 rounded-md border p-3 lg:p-4", styles)}
      {...props}
    >
      <p className="flex items-center gap-2 pb-4">
        <Icon />
        <span className="font-medium">{title}</span>
      </p>
      <div className="space-y-4 text-current">{children}</div>
    </div>
  );
}
