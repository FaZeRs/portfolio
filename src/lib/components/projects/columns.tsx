import { ColumnDef } from "@tanstack/react-table";
import { Project } from "~/lib/server/schema";
import { DataTableColumnHeader } from "../data-table/data-table-column-header";
import { Checkbox } from "../ui/checkbox";
import { Actions } from "./actions";

type ProjectType = typeof Project.$inferSelect;

export const projectColumns: ColumnDef<ProjectType>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all projects"
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
    header: ({ column }) => <DataTableColumnHeader column={column} title="Title" />,
    filterFn: "includesString",
  },
  {
    accessorKey: "description",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Description" />,
    filterFn: "includesString",
  },
  {
    accessorKey: "isFeatured",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Featured" />,
    cell: ({ row }) => (
      <Checkbox
        checked={row.original.isFeatured}
        aria-label={`${row.original.title} is featured: ${row.original.isFeatured ? "Yes" : "No"}`}
        disabled
      />
    ),
  },
  {
    accessorKey: "isDraft",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Draft" />,
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
      <Actions id={row.original.id} slug={row.original.slug} title={row.original.title} />
    ),
  },
];
