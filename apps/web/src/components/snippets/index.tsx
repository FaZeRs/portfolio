import { SnippetType } from "@acme/types";
import { Badge } from "@acme/ui/badge";
import { formatDate } from "@acme/utils";
import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowUpRight, Calendar, Code2 } from "lucide-react";

interface SnippetsProps {
  snippets: SnippetType[];
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4 },
  },
};

export default function Snippets({ snippets }: Readonly<SnippetsProps>) {
  return (
    <motion.div
      animate="visible"
      className="grid gap-4 sm:grid-cols-2"
      initial="hidden"
      variants={containerVariants}
    >
      {snippets.map((snippet) => (
        <motion.div key={snippet.slug} variants={itemVariants}>
          <Link
            className="group relative flex h-full flex-col overflow-hidden rounded-2xl border bg-card p-5 transition-all duration-300 hover:border-foreground/20 hover:shadow-xl"
            params={{
              snippetId: snippet.slug,
            }}
            to="/snippets/$snippetId"
          >
            {/* Hover gradient overlay */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-violet-500/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

            <div className="relative flex flex-1 flex-col gap-3">
              {/* Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                  <Code2 className="h-5 w-5 text-primary" />
                </div>
                <Badge className="shrink-0" variant="secondary">
                  {snippet.category}
                </Badge>
              </div>

              {/* Title */}
              <h3 className="font-semibold text-lg transition-colors group-hover:text-primary">
                {snippet.title}
              </h3>

              {/* Description */}
              {snippet.description && (
                <p className="line-clamp-2 text-muted-foreground text-sm leading-relaxed">
                  {snippet.description}
                </p>
              )}

              {/* Footer */}
              <div className="mt-auto flex items-center justify-between pt-3">
                <span className="flex items-center gap-1.5 text-muted-foreground text-xs">
                  <Calendar size={12} />
                  {formatDate(snippet.updatedAt ?? snippet.createdAt)}
                </span>
                <span className="flex items-center gap-1 text-primary text-sm opacity-0 transition-opacity group-hover:opacity-100">
                  View
                  <ArrowUpRight size={14} />
                </span>
              </div>
            </div>
          </Link>
        </motion.div>
      ))}
    </motion.div>
  );
}
