import { TOC } from "@acme/types";
import { cn } from "@acme/ui";
import { ScrollArea } from "@acme/ui/scroll-area";
import { List } from "lucide-react";
import { useMemo } from "react";
import useActiveItem from "~/hooks/use-active-item";
import useMounted from "~/hooks/use-mounted";

type TableOfContentProps = {
  toc: TOC[];
};

export default function TableOfContents({
  toc,
}: Readonly<TableOfContentProps>) {
  const itemIds = useMemo(() => toc.map((item) => item.url), [toc]);

  const mounted = useMounted();
  const activeHeading = useActiveItem(itemIds);

  if (!(toc && mounted)) {
    return null;
  }

  return (
    <div className="flex max-h-[calc(100vh-10rem)] flex-col rounded-2xl border border-border/50 bg-card/50 p-5 backdrop-blur-sm">
      <div className="flex shrink-0 items-center gap-2 pb-4">
        <List className="h-4 w-4 text-muted-foreground" />
        <p className="font-medium text-sm">On This Page</p>
      </div>
      <ScrollArea className="w-full">
        <div className="max-h-[calc(100vh-15rem)]">
          <Tree activeItem={activeHeading} tree={toc} />
        </div>
      </ScrollArea>
    </div>
  );
}

type TreeProps = {
  tree: TOC[];
  activeItem?: string | null;
};

const PADDING_LEFT = 12 as const;

function Tree({ tree, activeItem }: TreeProps) {
  const minDepth = Math.min(...tree.map((item) => item.depth));

  return tree?.length ? (
    <ul className="m-0 list-none space-y-1">
      {tree.map((item) => (
        <li key={item.url}>
          <a
            className={cn(
              "block rounded-lg py-1.5 text-sm no-underline transition-all",
              item.url === activeItem
                ? "bg-primary/10 font-medium text-primary"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
            href={`#${item.url}`}
            style={{
              paddingLeft: `${(item.depth - minDepth + 1) * PADDING_LEFT}px`,
              paddingRight: "12px",
            }}
          >
            {item.title}
          </a>
        </li>
      ))}
    </ul>
  ) : null;
}
