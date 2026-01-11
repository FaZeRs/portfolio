import { cn } from "@acme/ui";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { ComponentProps } from "react";

const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-xl font-medium text-sm outline-none transition-all duration-300 focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-md hover:scale-[1.02] hover:bg-primary/90 hover:shadow-lg active:scale-[0.98]",
        destructive:
          "bg-destructive text-white shadow-md hover:scale-[1.02] hover:bg-destructive/90 hover:shadow-lg focus-visible:ring-destructive/20 active:scale-[0.98] dark:bg-destructive/60 dark:focus-visible:ring-destructive/40",
        outline:
          "border border-border/50 bg-background/50 shadow-sm backdrop-blur-sm hover:scale-[1.02] hover:border-foreground/20 hover:bg-accent hover:text-accent-foreground hover:shadow-md active:scale-[0.98] dark:bg-white/5 dark:hover:bg-white/10",
        secondary:
          "bg-secondary text-secondary-foreground shadow-sm hover:scale-[1.02] hover:bg-secondary/80 hover:shadow-md active:scale-[0.98]",
        ghost:
          "hover:scale-[1.02] hover:bg-accent/80 hover:text-accent-foreground active:scale-[0.98] dark:hover:bg-accent/50",
        link: "text-primary underline-offset-4 hover:text-primary/80 hover:underline",
      },
      size: {
        default: "h-10 px-5 py-2.5 has-[>svg]:px-4",
        sm: "h-9 gap-1.5 rounded-lg px-4 has-[>svg]:px-3",
        lg: "h-12 rounded-xl px-8 has-[>svg]:px-6",
        icon: "size-10 rounded-xl",
        "icon-sm": "size-9 rounded-lg",
        "icon-lg": "size-11 rounded-xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      className={cn(buttonVariants({ variant, size, className }))}
      data-slot="button"
      {...props}
    />
  );
}

export { Button, buttonVariants };
