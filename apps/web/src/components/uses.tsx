import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Layers } from "lucide-react";
import type { SimpleIcon } from "simple-icons";
import { software } from "~/lib/constants/uses-data";

const createIconComponent =
  (icon: SimpleIcon) => (props: React.ComponentProps<"svg">) => (
    <svg {...props} fill="currentColor" viewBox="0 0 24 24">
      <title>{icon.title}</title>
      <path d={icon.path} />
    </svg>
  );

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3 },
  },
};

export default function Uses() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
          <Layers className="h-5 w-5 text-primary" />
        </div>
        <h2 className="font-semibold text-xl">Software & Applications</h2>
      </div>

      <motion.div
        animate="visible"
        className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8"
        initial="hidden"
        variants={containerVariants}
      >
        {software.map((item) => {
          const Icon = createIconComponent(item.icon);

          return (
            <motion.div key={item.name} variants={itemVariants}>
              <Link
                className="group flex flex-col items-center justify-center gap-3 rounded-2xl border bg-card p-4 transition-all duration-300 hover:border-foreground/20 hover:shadow-lg active:scale-95"
                rel="noopener noreferrer"
                target="_blank"
                to={item.link}
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted transition-colors group-hover:bg-primary/10">
                  <Icon className="h-6 w-6 transition-colors group-hover:text-primary" />
                </div>
                <p className="line-clamp-1 text-center font-medium text-xs">
                  {item.name}
                </p>
              </Link>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}
