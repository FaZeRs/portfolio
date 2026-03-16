import { useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "~/lib/query-keys";
import { $deleteService } from "~/lib/server/service";
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
  const queryClient = useQueryClient();

  return (
    <ResourceActions
      editPath={`/services/${id}/edit`}
      id={id}
      resourceType="service"
      title={title}
      trpcDeleteMutation={{
        mutationFn: (resourceId: string) =>
          $deleteService({ data: resourceId }),
        invalidateQuery: async () => {
          await queryClient.invalidateQueries({
            queryKey: queryKeys.service.all,
          });
        },
      }}
      viewPath={`/services/${slug}`}
    />
  );
}
