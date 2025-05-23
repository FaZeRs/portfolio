import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTRPC } from "~/trpc/react";
import { ResourceActions } from "../resource-actions";

interface DataTableRowActionsProps {
  id: string;
  slug: string;
  title: string;
}

export function Actions({
  id,
  slug,
  title,
}: Readonly<DataTableRowActionsProps>) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    ...trpc.project.delete.mutationOptions(),
  });

  return (
    <ResourceActions
      id={id}
      title={title}
      resourceType="project"
      viewPath={`/projects/${slug}`}
      editPath={`/dashboard/projects/${id}/edit`}
      trpcDeleteMutation={{
        mutationFn: (id: string) => mutation.mutateAsync(id),
        invalidateQuery: async () => {
          await queryClient.invalidateQueries(trpc.project.pathFilter());
        },
      }}
    />
  );
}
