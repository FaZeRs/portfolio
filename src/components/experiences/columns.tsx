import { ColumnDef } from "@tanstack/react-table";
import { ExperienceType } from "~/types";
import { DataTableColumnHeader } from "../data-table/data-table-column-header";
import { Checkbox } from "../ui/checkbox";
import { Actions } from "./actions";

export const experienceColumns: ColumnDef<ExperienceType>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all experiences"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label={`Select ${row.original.title}`}
        disabled={!row.getCanSelect()}
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "title",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Title" />
    ),
    filterFn: "includesString",
  },
  {
    accessorKey: "institution",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Institution" />
    ),
    filterFn: "includesString",
  },
  {
    accessorKey: "description",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Description" />
    ),
    cell: ({ row }) => (
      <div className="text-wrap">{row.original.description}</div>
    ),
    filterFn: "includesString",
  },
  {
    accessorKey: "isOnGoing",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="On Going" />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.original.isOnGoing}
        aria-label={`${row.original.title} is on going: ${row.original.isOnGoing ? "Yes" : "No"}`}
        disabled
      />
    ),
  },
  {
    accessorKey: "isDraft",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Draft" />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.original.isDraft}
        aria-label={`${row.original.title} is draft: ${row.original.isDraft ? "Yes" : "No"}`}
        disabled
      />
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <Actions id={row.original.id} title={row.original.title} />
    ),
  },
];
