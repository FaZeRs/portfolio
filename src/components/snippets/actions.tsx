import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTRPC } from "~/trpc/react";
import { ResourceActions } from "../resource-actions";

interface DataTableRowActionsProps {
  id: string;
  title: string;
  slug: string;
}

export function Actions({
  id,
  title,
  slug,
}: Readonly<DataTableRowActionsProps>) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    ...trpc.snippet.delete.mutationOptions(),
  });

  return (
    <ResourceActions
      id={id}
      title={title}
      resourceType="snippet"
      viewPath={`/snippets/${slug}`}
      editPath={`/dashboard/snippets/${id}/edit`}
      trpcDeleteMutation={{
        mutationFn: (id: string) => mutation.mutateAsync(id),
        invalidateQuery: async () => {
          await queryClient.invalidateQueries(trpc.snippet.pathFilter());
        },
      }}
    />
  );
}
