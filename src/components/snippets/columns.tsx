import { ColumnDef } from "@tanstack/react-table";
import { createCommonColumns } from "~/lib/utils/columns";
import { SnippetType } from "~/types";
import { Actions } from "./actions";

export const snippetColumns: ColumnDef<SnippetType>[] = [
  ...createCommonColumns<SnippetType>("snippets"),
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
