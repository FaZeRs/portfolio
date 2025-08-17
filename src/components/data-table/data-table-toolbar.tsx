import { X } from "lucide-react";

import { Button } from "../ui/button";
import { Input } from "../ui/input";

type DataTableToolbarProps = {
  globalFilter: string;
  setGlobalFilter: (value: string) => void;
};

export function DataTableToolbar({
  globalFilter,
  setGlobalFilter,
}: Readonly<DataTableToolbarProps>) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          className="h-8 w-[150px] lg:w-[250px]"
          onChange={(event) => {
            setGlobalFilter(String(event.target.value));
          }}
          placeholder="Filter projects..."
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
