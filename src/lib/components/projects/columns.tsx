import { ColumnDef } from "@tanstack/react-table";
import { Project } from "~/lib/server/schema";
import { DataTableColumnHeader } from "../data-table/data-table-column-header";
import { Checkbox } from "../ui/checkbox";
import { Actions } from "./actions";

export const columns: ColumnDef<typeof Project.$inferSelect>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "title",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Title" />,
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <Actions row={row} id={row.original.id} slug={row.original.slug} />
    ),
  },
];
