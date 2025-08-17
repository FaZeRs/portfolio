import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTRPC } from "~/trpc/react";
import { ResourceActions } from "../resource-actions";

type DataTableRowActionsProps = {
  id: string;
  slug: string;
  title: string;
};

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
      editPath={`/dashboard/projects/${id}/edit`}
      id={id}
      resourceType="project"
      title={title}
      trpcDeleteMutation={{
        mutationFn: (resourceId: string) => mutation.mutateAsync(resourceId),
        invalidateQuery: async () => {
          await queryClient.invalidateQueries(trpc.project.pathFilter());
        },
      }}
      viewPath={`/projects/${slug}`}
    />
  );
}
