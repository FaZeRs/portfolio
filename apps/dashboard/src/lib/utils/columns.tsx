import { Checkbox } from "@acme/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "~/components/data-table/data-table-column-header";

export interface BaseItemType {
  description: string | null;
  id: string;
  isDraft: boolean;
  title: string;
}

export function createCommonColumns<T extends BaseItemType>(
  entityName: string
): ColumnDef<T>[] {
  return [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          aria-label={`Select all ${entityName}`}
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) =>
            table.toggleAllPageRowsSelected(Boolean(value))
          }
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          aria-label={`Select ${row.original.title}`}
          checked={row.getIsSelected()}
          disabled={!row.getCanSelect()}
          onCheckedChange={(value) => row.toggleSelected(Boolean(value))}
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
      accessorKey: "isDraft",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Draft" />
      ),
      cell: ({ row }) => (
        <Checkbox
          aria-label={`${row.original.title} is draft: ${row.original.isDraft ? "Yes" : "No"}`}
          checked={row.original.isDraft}
          disabled
        />
      ),
    },
  ];
}

export function createToggleColumn<T extends { title: string }>(
  accessorKey: keyof T & string,
  title: string
): ColumnDef<T> {
  return {
    accessorKey,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={title} />
    ),
    cell: ({ row }) => {
      const value = row.original[accessorKey] as unknown as boolean;
      return (
        <Checkbox
          aria-label={`${row.original.title} is ${title.toLowerCase()}: ${
            value ? "Yes" : "No"
          }`}
          checked={value}
          disabled
        />
      );
    },
  };
}
