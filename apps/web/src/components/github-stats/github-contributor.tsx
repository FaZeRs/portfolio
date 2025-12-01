import { useTheme } from "@acme/ui/theme-provider";
import { ClientOnly } from "@tanstack/react-router";
import { GitHubCalendar } from "react-github-calendar";
import GithubActivityGraph from "~/components/github-stats/github-activity-graph";

export default function GithubContributor() {
  const { resolvedTheme } = useTheme();
  const currentYear = new Date().getFullYear();

  return (
    <div className="mt-12">
      <div className="font-bold font-heading text-3xl text-neutral-900 capitalize sm:text-4xl dark:text-neutral-200">
        GitHub Contributor
      </div>
      <div className="text-muted-foreground">
        The following is my GitHub contribution graph which shows my coding
        activity and productivity on the platform.
      </div>

      <div className="mt-8 space-y-8">
        <div className="font-bold font-heading text-neutral-900 text-xl capitalize sm:text-2xl dark:text-neutral-200">
          In {currentYear}
        </div>
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
        <GithubActivityGraph />
      </div>
    </div>
  );
}
