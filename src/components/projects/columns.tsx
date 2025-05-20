import { ColumnDef } from "@tanstack/react-table";

import { createCommonColumns, createToggleColumn } from "~/lib/utils/columns";
import { ProjectType } from "~/types";
import { Actions } from "./actions";

export const projectColumns: ColumnDef<ProjectType>[] = [
  ...createCommonColumns<ProjectType>("projects"),
  createToggleColumn<ProjectType>("isFeatured", "Featured"),
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
