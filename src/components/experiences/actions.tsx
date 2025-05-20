import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTRPC } from "~/trpc/react";
import { ResourceActions } from "../resource-actions";

interface DataTableRowActionsProps {
  id: string;
  title: string;
}

export function Actions({ id, title }: Readonly<DataTableRowActionsProps>) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    ...trpc.experience.delete.mutationOptions(),
  });

  return (
    <ResourceActions
      id={id}
      title={title}
      resourceType="experience"
      editPath={`/dashboard/experiences/${id}/edit`}
      trpcDeleteMutation={{
        mutationFn: (id: string) => mutation.mutateAsync(id),
        invalidateQuery: async () => {
          await queryClient.invalidateQueries(trpc.experience.pathFilter());
        },
      }}
    />
  );
}
