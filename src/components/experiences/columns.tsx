import { ColumnDef } from "@tanstack/react-table";
import { createCommonColumns, createToggleColumn } from "~/lib/utils/columns";
import { ExperienceType } from "~/types";
import { DataTableColumnHeader } from "../data-table/data-table-column-header";
import { Actions } from "./actions";

export const experienceColumns: ColumnDef<ExperienceType>[] = [
  ...createCommonColumns<ExperienceType>("experiences"),
  {
    accessorKey: "institution",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Institution" />
    ),
    filterFn: "includesString",
  },
  createToggleColumn<ExperienceType>("isOnGoing", "On Going"),
  {
    id: "actions",
    cell: ({ row }) => (
      <Actions id={row.original.id} title={row.original.title} />
    ),
  },
];
