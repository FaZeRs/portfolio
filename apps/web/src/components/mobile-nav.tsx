import type { NavItem } from "@acme/types";
import { cn } from "@acme/ui";
import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

type MobileNavProps = {
  children?: ReactNode;
  items: NavItem[];
  onItemClick?: () => void;
};

const MobileNav = ({ items, children, onItemClick }: MobileNavProps) => (
  <div
    className={cn(
      "slide-in-from-top-8 fixed inset-0 top-15 z-50 grid h-[calc(100vh-4rem)] animate-in grid-flow-row auto-rows-max overflow-auto p-6 pb-32 shadow-md"
    )}
  >
    <div className="relative z-20 grid gap-6 rounded-md bg-popover p-4 text-popover-foreground shadow-md">
      <nav className="grid grid-flow-row auto-rows-max text-sm">
        {items.map((item) =>
          item.content ? (
            item.content.map((subItem) => (
              <Link
                className={cn(
                  "flex w-full items-center rounded-md p-2 font-medium text-sm hover:underline",
                  subItem.disabled && "cursor-not-allowed opacity-60"
                )}
                key={subItem.href}
                onClick={onItemClick}
                to={subItem.disabled ? "#" : subItem.href}
              >
                {subItem.title}
              </Link>
            ))
          ) : (
            <Link
              className={cn(
                "flex w-full items-center rounded-md p-2 font-medium text-sm hover:underline",
                item.disabled && "cursor-not-allowed opacity-60"
              )}
              key={item.href}
              onClick={onItemClick}
              to={item.disabled ? "#" : (item.href ?? "#")}
            >
              {item.title}
            </Link>
          )
        )}
      </nav>
      {children}
    </div>
  </div>
);

export default MobileNav;
