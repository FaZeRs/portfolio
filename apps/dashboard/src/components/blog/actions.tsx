import { useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "~/lib/query-keys";
import { $deleteArticle } from "~/lib/server/blog";
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
      editPath={`/blog/${id}/edit`}
      id={id}
      resourceType="blog"
      title={title}
      trpcDeleteMutation={{
        mutationFn: (resourceId: string) =>
          $deleteArticle({ data: resourceId }),
        invalidateQuery: async () => {
          await queryClient.invalidateQueries({
            queryKey: queryKeys.blog.all,
          });
        },
      }}
      viewPath={`/blog/${slug}`}
    />
  );
}
