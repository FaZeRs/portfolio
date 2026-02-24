import { Button } from "@acme/ui/button";
import { Input } from "@acme/ui/input";
import { X } from "lucide-react";

interface DataTableToolbarProps {
  entityName?: string;
  globalFilter: string;
  setGlobalFilter: (value: string) => void;
}

export function DataTableToolbar({
  globalFilter,
  setGlobalFilter,
  entityName = "items",
}: Readonly<DataTableToolbarProps>) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          className="h-8 w-[150px] lg:w-[250px]"
          onChange={(event) => {
            setGlobalFilter(String(event.target.value));
          }}
          placeholder={`Filter ${entityName}...`}
          value={globalFilter ?? ""}
        />
        {globalFilter && (
          <Button
            className="h-8 px-2 lg:px-3"
            onClick={() => setGlobalFilter("")}
            variant="ghost"
          >
            Reset
            <X />
          </Button>
        )}
      </div>
    </div>
  );
}
