import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "~/components/data-table/data-table-column-header";
import { Checkbox } from "~/components/ui/checkbox";

export interface BaseItemType {
  id: string;
  title: string;
  description: string | null;
  isDraft: boolean;
}

export function createCommonColumns<T extends BaseItemType>(
  entityName: string,
): ColumnDef<T>[] {
  return [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label={`Select all ${entityName}`}
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
          checked={row.original.isDraft}
          aria-label={`${row.original.title} is draft: ${row.original.isDraft ? "Yes" : "No"}`}
          disabled
        />
      ),
    },
  ];
}

export function createToggleColumn<T extends { title: string }>(
  accessorKey: keyof T & string,
  title: string,
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
          checked={value}
          aria-label={`${row.original.title} is ${title.toLowerCase()}: ${
            value ? "Yes" : "No"
          }`}
          disabled
        />
      );
    },
  };
}
