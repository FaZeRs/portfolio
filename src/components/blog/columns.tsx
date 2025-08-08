import { ColumnDef } from "@tanstack/react-table";

import { createCommonColumns } from "~/lib/utils/columns";
import { ArticleType } from "~/types";
import { Actions } from "./actions";

export const blogColumns: ColumnDef<ArticleType>[] = [
  ...createCommonColumns<ArticleType>("articles"),
  {
    id: "actions",
    cell: ({ row }) => (
      <Actions
        id={row.original.id}
        slug={row.original.slug}
        title={row.original.title}
      />
    ),
  },
];
