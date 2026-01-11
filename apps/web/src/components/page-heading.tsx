import { cn } from "@acme/ui";
import { Slot } from "@radix-ui/react-slot";
import { motion } from "framer-motion";
import type { HTMLAttributes } from "react";

const MotionDiv = motion.create("div");
const MotionSlot = motion.create(Slot);

interface PageHeadingProps extends HTMLAttributes<HTMLHeadingElement> {
  title: string;
  description?: string | null;
  asChild?: boolean;
  hasMotion?: boolean;
}

const PageHeading = ({
  title,
  description,
  asChild,
  className,
  hasMotion = true,
}: PageHeadingProps) => {
  const Comp = (() => {
    if (hasMotion) {
      return asChild ? MotionSlot : MotionDiv;
    }
    return asChild ? Slot : "div";
  })();

  return (
    <Comp
      animate={{ opacity: 1, y: 0 }}
      className={cn("mb-10", className)}
      initial={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.5 }}
    >
      <div className="relative">
        {/* Decorative gradient */}
        <div className="-top-4 -left-4 pointer-events-none absolute h-24 w-24 rounded-full bg-gradient-to-br from-violet-500/20 to-pink-500/20 blur-2xl" />

        <div className="relative space-y-3">
          <h1 className="font-bold text-3xl tracking-tight md:text-4xl lg:text-5xl">
            {title}
          </h1>
          {description && (
            <p className="max-w-2xl text-muted-foreground leading-relaxed md:text-lg">
              {description}
            </p>
          )}
        </div>
      </div>
    </Comp>
  );
};

export default PageHeading;
