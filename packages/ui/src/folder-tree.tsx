import { cn } from "@acme/ui";
import { FileCode, Folder } from "lucide-react";
import { Fragment } from "react";

interface Node {
  children?: Node[];
  isHighlighted?: boolean;
  name: string;
}

interface FolderTreeProps {
  data: Node[];
  title?: string;
}

export default function FolderTree({ title, data }: Readonly<FolderTreeProps>) {
  return (
    <div className="mt-6 overflow-hidden rounded-lg border bg-background font-mono shadow-surface-elevation-low dark:bg-[#0A0A0A]">
      {title && (
        <div className="mb-0.5 rounded-md bg-rose-100/10 px-3 py-1 text-rose-100/70 text-xs shadow-sm">
          {title}
        </div>
      )}
      <div className="py-3 text-[13px] leading-6 [counter-reset:line]">
        <Inner data={data} level={0} />
      </div>
    </div>
  );
}

interface InnerProps {
  data: Node[];
  level: number;
}

const Inner = ({ data, level }: InnerProps) => (
  <>
    {data.map((node) => (
      <Fragment key={node.name}>
        <div
          className={cn(
            "flex items-center space-x-2 border-l-4 border-l-transparent pr-4 before:mr-4 before:ml-2 before:inline-block before:w-4 before:text-right before:[content:counter(line)] before:[counter-increment:line]",
            {
              "border-l-slate-400/70 bg-gray-200/80 before:text-white/70 dark:border-l-rose-300/30 dark:bg-secondary":
                node.isHighlighted,
              "before:text-white/20": !node.isHighlighted,
            }
          )}
        >
          <div
            className={cn(
              node.isHighlighted ? "text-primary" : "text-muted-foreground",
              {
                "pl-[20px]": level === 1,
                "pl-[40px]": level === 2,
                "pl-[60px]": level === 3,
                "pl-[80px]": level === 4,
              }
            )}
          >
            {node.children ? (
              <Folder className="w-4" />
            ) : (
              <FileCode className="w-4" />
            )}
          </div>
          <div
            className={cn(
              node.isHighlighted ? "text-primary" : "text-muted-foreground"
            )}
          >
            {node.name}
          </div>
        </div>

        {node.children && <Inner data={node.children} level={level + 1} />}
      </Fragment>
    ))}
  </>
);
