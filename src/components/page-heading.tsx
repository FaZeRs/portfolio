import { Slot } from "@radix-ui/react-slot";
import { motion } from "framer-motion";
import type { HTMLAttributes } from "react";

import { cn } from "~/lib/utils";

import { slideInWithFadeOut } from "~/lib/constants/framer-motion-variants";

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
      initial="hidden"
      animate="visible"
      exit="hidden"
      variants={slideInWithFadeOut}
      className={cn(
        "font-medium text-2xl leading-relaxed dark:text-white",
        className,
      )}
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
