import { useSuspenseQuery } from "@tanstack/react-query";
import { queryKeys } from "~/lib/query-keys";
import { $getMonthlyBlogViews } from "~/lib/server/stats";
import { StatsChart } from "./stats-chart";

export function BlogViewsStats() {
  const { data } = useSuspenseQuery({
    queryKey: queryKeys.stats.monthlyBlogViews(6),
    queryFn: () => $getMonthlyBlogViews({ data: { months: 6 } }),
  });
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
