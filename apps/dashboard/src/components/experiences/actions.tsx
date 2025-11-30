import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTRPC } from "~/lib/trpc";
import { ResourceActions } from "../resource-actions";

type DataTableRowActionsProps = {
  id: string;
  title: string;
};

export function Actions({ id, title }: Readonly<DataTableRowActionsProps>) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    ...trpc.experience.delete.mutationOptions(),
  });

  return (
    <ResourceActions
      editPath={`/experiences/${id}/edit`}
      id={id}
      resourceType="experience"
      title={title}
      trpcDeleteMutation={{
        mutationFn: (resourceId: string) => mutation.mutateAsync(resourceId),
        invalidateQuery: async () => {
          await queryClient.invalidateQueries(trpc.experience.pathFilter());
        },
      }}
    />
  );
}
