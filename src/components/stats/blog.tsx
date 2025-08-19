import { useSuspenseQuery } from "@tanstack/react-query";
import { useTRPC } from "~/trpc/react";
import { StatsChart } from "./stats-chart";

export function BlogViewsStats() {
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(
    trpc.stats.monthlyBlogViews.queryOptions({ months: 6 })
  );
  return (
    <StatsChart
      chartColor="var(--chart-2)"
      data={data}
      description="Last 6 months"
      label="Views"
      title="Blog Views"
    />
  );
}
