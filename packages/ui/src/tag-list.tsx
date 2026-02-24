import { Badge } from "./badge";

interface TagListProps {
  className?: string;
  items: string[];
  maxDisplay?: number;
  size?: "sm" | "default";
  variant?: "default" | "secondary" | "destructive" | "outline";
}

export function TagList({
  items,
  maxDisplay = 2,
  variant = "secondary",
  size = "sm",
  className = "",
}: TagListProps) {
  if (!items?.length) {
    return null;
  }

  const textSizeClass = size === "sm" ? "text-[10px]" : "text-xs";

  return (
    <div className={`flex flex-wrap gap-1 ${className}`}>
      {items.slice(0, maxDisplay).map((item) => (
        <Badge className={textSizeClass} key={item} variant={variant}>
          {item}
        </Badge>
      ))}
      {items.length > maxDisplay && (
        <Badge className={textSizeClass} variant="outline">
          +{items.length - maxDisplay}
        </Badge>
      )}
    </div>
  );
}
