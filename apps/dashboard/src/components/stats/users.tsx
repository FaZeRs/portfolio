import { useSuspenseQuery } from "@tanstack/react-query";
import { queryKeys } from "~/lib/query-keys";
import { $getMonthlyUsers } from "~/lib/server/stats";
import { StatsChart } from "./stats-chart";

export function UsersStats() {
  const { data } = useSuspenseQuery({
    queryKey: queryKeys.stats.monthlyUsers(6),
    queryFn: () => $getMonthlyUsers({ data: { months: 6 } }),
  });
  return (
    <StatsChart
      chartColor="var(--chart-1)"
      data={data}
      description="Last 6 months"
      label="Users"
      title="Registered Users"
    />
  );
}
