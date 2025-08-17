import { Slot } from "@radix-ui/react-slot";
import { motion } from "framer-motion";
import type { HTMLAttributes } from "react";
import { slideInWithFadeOut } from "~/lib/constants/framer-motion-variants";
import { cn } from "~/lib/utils";

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
  const BaseComp = asChild ? Slot : "h1";
  const Comp = hasMotion ? motion.create(BaseComp) : BaseComp;

  return (
    <Comp
      animate="visible"
      className={cn(
        "font-medium text-2xl leading-relaxed dark:text-white",
        className
      )}
      exit="hidden"
      initial="hidden"
      variants={slideInWithFadeOut}
    >
      <div className="space-y-1">
        <h1 className="inline-block font-heading text-2xl tracking-tight md:text-3xl lg:text-4xl">
          {title}
        </h1>
        <p className="text-base text-muted-foreground md:text-lg">
          {description}
        </p>
      </div>
      <hr className="my-6 md:my-4" />
    </Comp>
  );
};

export default PageHeading;
