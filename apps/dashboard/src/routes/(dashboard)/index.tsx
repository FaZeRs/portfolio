import { createFileRoute } from "@tanstack/react-router";
import { BlogViewsStats } from "~/components/stats/blog";
import { UsersStats } from "~/components/stats/users";

export const Route = createFileRoute("/(dashboard)/")({
  component: DashboardIndex,
  loader: async ({ context: { trpc, queryClient } }) => {
    await queryClient.prefetchQuery(
      trpc.stats.monthlyBlogViews.queryOptions({ months: 6 })
    );
    await queryClient.prefetchQuery(
      trpc.stats.monthlyUsers.queryOptions({ months: 6 })
    );
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
