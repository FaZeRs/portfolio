import { ServiceType } from "@acme/types";
import { ColumnDef } from "@tanstack/react-table";
import { createCommonColumns } from "~/lib/utils/columns";
import { Actions } from "./actions";

export const serviceColumns: ColumnDef<ServiceType>[] = [
  ...createCommonColumns<ServiceType>("services"),
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
