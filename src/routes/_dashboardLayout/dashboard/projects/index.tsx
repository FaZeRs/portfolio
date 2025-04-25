import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Plus } from "lucide-react";

import { DataTable } from "~/lib/components/data-table/data-table";
import { projectColumns } from "~/lib/components/projects/columns";
import { buttonVariants } from "~/lib/components/ui/button";
import { cn } from "~/lib/utils";
import { useTRPC } from "~/trpc/react";

export const Route = createFileRoute("/_dashboardLayout/dashboard/projects/")({
  component: Projects,
  loader: async ({ context: { trpc, queryClient } }) =>
    await queryClient.prefetchQuery(trpc.project.all.queryOptions()),
  head: () => ({
    meta: [{ title: "Projects" }],
  }),
});

function Projects() {
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(trpc.project.all.queryOptions());

  return (
    <>
      <div className="mb-2 flex flex-wrap items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Project List</h2>
          <p className="text-muted-foreground">Manage your projects here.</p>
        </div>
        <div className="flex gap-2">
          <Link
            to="/dashboard/projects/create"
            className={cn(buttonVariants({ variant: "default" }), "group")}
          >
            <span>Add Project</span> <Plus size={18} />
          </Link>
        </div>
      </div>
      <DataTable columns={projectColumns} data={data} />
    </>
  );
}
