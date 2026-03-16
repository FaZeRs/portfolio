import { createFileRoute } from "@tanstack/react-router";
import { BlogViewsStats } from "~/components/stats/blog";
import { UsersStats } from "~/components/stats/users";
import { queryKeys } from "~/lib/query-keys";
import { $getMonthlyBlogViews, $getMonthlyUsers } from "~/lib/server/stats";

export const Route = createFileRoute("/(dashboard)/")({
  component: DashboardIndex,
  loader: async ({ context: { queryClient } }) => {
    await Promise.all([
      queryClient.prefetchQuery({
        queryKey: queryKeys.stats.monthlyBlogViews(6),
        queryFn: () => $getMonthlyBlogViews({ data: { months: 6 } }),
      }),
      queryClient.prefetchQuery({
        queryKey: queryKeys.stats.monthlyUsers(6),
        queryFn: () => $getMonthlyUsers({ data: { months: 6 } }),
      }),
    ]);
  },
});

function DashboardIndex() {
  return (
    <div className="flex flex-col gap-1 sm:flex-row">
      <div className="basis-1/2">
        <UsersStats />
      </div>
      <div className="basis-1/2">
        <BlogViewsStats />
      </div>
    </div>
  );
}
