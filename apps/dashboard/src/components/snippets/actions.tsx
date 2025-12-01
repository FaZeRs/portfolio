import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTRPC } from "~/lib/trpc";
import { ResourceActions } from "../resource-actions";

type DataTableRowActionsProps = {
  id: string;
  title: string;
  slug: string;
};

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
      editPath={`/snippets/${id}/edit`}
      id={id}
      resourceType="snippet"
      title={title}
      trpcDeleteMutation={{
        mutationFn: (resourceId: string) => mutation.mutateAsync(resourceId),
        invalidateQuery: async () => {
          await queryClient.invalidateQueries(trpc.snippet.pathFilter());
        },
      }}
      viewPath={`/snippets/${slug}`}
    />
  );
}
