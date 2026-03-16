import { useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "~/lib/query-keys";
import { $deleteExperience } from "~/lib/server/experience";
import { ResourceActions } from "../resource-actions";

interface DataTableRowActionsProps {
  id: string;
  title: string;
}

export function Actions({ id, title }: Readonly<DataTableRowActionsProps>) {
  const queryClient = useQueryClient();

  return (
    <ResourceActions
      editPath={`/experiences/${id}/edit`}
      id={id}
      resourceType="experience"
      title={title}
      trpcDeleteMutation={{
        mutationFn: (resourceId: string) =>
          $deleteExperience({ data: resourceId }),
        invalidateQuery: async () => {
          await queryClient.invalidateQueries({
            queryKey: queryKeys.experience.all,
          });
        },
      }}
    />
  );
}
