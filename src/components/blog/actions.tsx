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
    ...trpc.blog.delete.mutationOptions(),
  });

  return (
    <ResourceActions
      editPath={`/dashboard/blog/${id}/edit`}
      id={id}
      resourceType="blog"
      title={title}
      trpcDeleteMutation={{
        mutationFn: (resourceId: string) => mutation.mutateAsync(resourceId),
        invalidateQuery: async () => {
          await queryClient.invalidateQueries(trpc.blog.pathFilter());
        },
      }}
      viewPath={`/blog/${slug}`}
    />
  );
}
