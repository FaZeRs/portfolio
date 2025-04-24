import { createFileRoute, Link } from "@tanstack/react-router";
import { Plus } from "lucide-react";

import { DataTable } from "~/lib/components/data-table/data-table";
import { columns } from "~/lib/components/projects/columns";
import { buttonVariants } from "~/lib/components/ui/button";
import { cn } from "~/lib/utils";

export const Route = createFileRoute("/_dashboardLayout/dashboard/projects/")({
  component: Projects,
  loader: async ({ context: { trpc, queryClient } }) => {
    const projects = await queryClient.fetchQuery(trpc.project.all.queryOptions());
    return { projects };
  },
});

function Projects() {
  const { projects } = Route.useLoaderData();

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
      <DataTable columns={columns} data={projects} />
    </>
  );
}
