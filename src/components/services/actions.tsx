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
    ...trpc.service.delete.mutationOptions(),
  });

  return (
    <ResourceActions
      editPath={`/dashboard/services/${id}/edit`}
      id={id}
      resourceType="service"
      title={title}
      trpcDeleteMutation={{
        mutationFn: (resourceId: string) => mutation.mutateAsync(resourceId),
        invalidateQuery: async () => {
          await queryClient.invalidateQueries(trpc.service.pathFilter());
        },
      }}
      viewPath={`/services/${slug}`}
    />
  );
}
