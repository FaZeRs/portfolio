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
        <div className="relative w-full max-w-[250px]">
          <Input
            placeholder="Filter projects..."
            value={globalFilter ?? ""}
            onChange={(event) => {
              setGlobalFilter(String(event.target.value));
            }}
            className="h-8 w-full pr-8"
            aria-label="Filter projects"
          />
          {globalFilter && (
            <Button
              variant="ghost"
              onClick={() => setGlobalFilter("")}
              className="absolute right-0 top-0 h-8 px-2"
              aria-label="Clear filter"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
