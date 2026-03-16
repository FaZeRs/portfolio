import { useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "~/lib/query-keys";
import { $deleteSnippet } from "~/lib/server/snippet";
import { ResourceActions } from "../resource-actions";

interface DataTableRowActionsProps {
  id: string;
  slug: string;
  title: string;
}

export function Actions({
  id,
  title,
  slug,
}: Readonly<DataTableRowActionsProps>) {
  const queryClient = useQueryClient();

  return (
    <ResourceActions
      editPath={`/snippets/${id}/edit`}
      id={id}
      resourceType="snippet"
      title={title}
      trpcDeleteMutation={{
        mutationFn: (resourceId: string) =>
          $deleteSnippet({ data: resourceId }),
        invalidateQuery: async () => {
          await queryClient.invalidateQueries({
            queryKey: queryKeys.snippet.all,
          });
        },
      }}
      viewPath={`/snippets/${slug}`}
    />
  );
}
