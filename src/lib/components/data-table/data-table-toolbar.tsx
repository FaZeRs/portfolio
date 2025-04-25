import { X } from "lucide-react";

import { Button } from "../ui/button";
import { Input } from "../ui/input";

interface DataTableToolbarProps {
  globalFilter: string;
  setGlobalFilter: (value: string) => void;
}

export function DataTableToolbar({
  globalFilter,
  setGlobalFilter,
}: DataTableToolbarProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Filter projects..."
          value={globalFilter ?? ""}
          onChange={(event) => {
            console.log("event", event.target.value);
            setGlobalFilter(String(event.target.value));
          }}
          className="h-8 w-[150px] lg:w-[250px]"
        />
        {globalFilter && (
          <Button
            variant="ghost"
            onClick={() => setGlobalFilter("")}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <X />
          </Button>
        )}
      </div>
    </div>
  );
}
