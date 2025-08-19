import { useSuspenseQuery } from "@tanstack/react-query";
import { useTRPC } from "~/trpc/react";
import { StatsChart } from "./stats-chart";

export function UsersStats() {
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(
    trpc.stats.monthlyUsers.queryOptions({ months: 6 })
  );
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
