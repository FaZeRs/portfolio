import { TOC } from "@acme/types";
import { cn } from "@acme/ui";
import useActiveItem from "~/hooks/use-active-item";
import useMounted from "~/hooks/use-mounted";

type TableOfContentProps = {
  toc: TOC[];
};

export default function TableOfContents({
  toc,
}: Readonly<TableOfContentProps>) {
  const itemIds = toc.map((item) => item.url);

  const mounted = useMounted();
  const activeHeading = useActiveItem(itemIds);

  if (!(toc && mounted)) {
    return null;
  }

  return (
    <div className="space-y-2">
      <p className="font-medium uppercase">On This Page</p>
      <Tree activeItem={activeHeading} tree={toc} />
    </div>
  );
}

type TreeProps = {
  tree: TOC[];
  activeItem?: string | null;
};

const PADDING_LEFT = 16 as const;

function Tree({ tree, activeItem }: TreeProps) {
  const minDepth = Math.min(...tree.map((item) => item.depth));

  return tree?.length ? (
    <ul className={cn("m-0 list-none")}>
      {tree.map((item) => (
        <li className={cn("mt-0")} key={item.url}>
          <a
            className={cn(
              "inline-block border-l-2 py-1.5 pl-4 no-underline transition-all hover:text-primary hover:underline",
              item.url === activeItem
                ? "border-primary text-primary"
                : "text-muted-foreground text-sm"
            )}
            href={`#${item.url}`}
            style={{
              paddingLeft: `${(item.depth - minDepth + 1) * PADDING_LEFT}px`,
            }}
          >
            {item.title}
          </a>
        </li>
      ))}
    </ul>
  ) : null;
}
