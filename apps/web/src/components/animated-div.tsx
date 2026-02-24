import { motion, Variants } from "framer-motion";
import { HTMLAttributes, ReactNode } from "react";

interface AnimatedDivProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  infinity?: boolean;
  variants: Variants;
}

export default function AnimatedDiv({
  variants,
  className,
  children,
  infinity,
}: AnimatedDivProps) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      transition={{ staggerChildren: 0.5 }}
      variants={variants}
      viewport={{ once: !infinity }}
      whileInView="visible"
    >
      {children}
    </motion.div>
  );
}
