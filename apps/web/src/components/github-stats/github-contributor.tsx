import { useTheme } from "@acme/shared/theme-provider";
import { ClientOnly } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Calendar, GitBranch } from "lucide-react";
import { GitHubCalendar } from "react-github-calendar";
import GithubActivityGraph from "~/components/github-stats/github-activity-graph";

export default function GithubContributor() {
  const { resolvedTheme } = useTheme();
  const currentYear = new Date().getFullYear();

  return (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      className="mt-16 space-y-8"
      initial={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
            <GitBranch className="h-5 w-5 text-primary" />
          </div>
          <h2 className="font-bold text-2xl tracking-tight sm:text-3xl">
            GitHub Contributions
          </h2>
        </div>
        <p className="max-w-2xl text-muted-foreground">
          My coding activity and contributions on GitHub throughout the year.
        </p>
      </div>

      {/* Calendar section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Calendar size={16} />
          <span className="font-medium text-sm">{currentYear}</span>
        </div>
        <div className="overflow-hidden rounded-2xl border bg-card p-6">
          <div className="w-full overflow-x-auto">
            <ClientOnly>
              <div className="min-w-full">
                <GitHubCalendar
                  colorScheme={resolvedTheme === "dark" ? "dark" : "light"}
                  style={{
                    width: "100%",
                  }}
                  username="FaZeRs"
                  year={currentYear}
                />
              </div>
            </ClientOnly>
          </div>
        </div>
      </div>

      {/* Activity graph */}
      <GithubActivityGraph />
    </motion.div>
  );
}
