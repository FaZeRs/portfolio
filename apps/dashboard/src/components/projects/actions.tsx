import { useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "~/lib/query-keys";
import { $deleteProject } from "~/lib/server/project";
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
      editPath={`/projects/${id}/edit`}
      id={id}
      resourceType="project"
      title={title}
      trpcDeleteMutation={{
        mutationFn: (resourceId: string) =>
          $deleteProject({ data: resourceId }),
        invalidateQuery: async () => {
          await queryClient.invalidateQueries({
            queryKey: queryKeys.project.all,
          });
        },
      }}
      viewPath={`/projects/${slug}`}
    />
  );
}
