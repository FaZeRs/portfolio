import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

import { cn } from "~/lib/utils";

import type { NavItem } from "~/types";

interface MobileNavProps {
  children?: ReactNode;
  items: NavItem[];
}

const MobileNav = ({ items, children }: MobileNavProps) => {
  return (
    <div
      className={cn(
        "fixed inset-0 top-16 z-50 grid h-[calc(100vh-4rem)] grid-flow-row auto-rows-max overflow-auto p-6 pb-32 shadow-md animate-in slide-in-from-top-8",
      )}
    >
      <div className="relative z-20 grid gap-6 rounded-md bg-popover p-4 text-popover-foreground shadow-md">
        <nav className="grid grid-flow-row auto-rows-max text-sm">
          {items.map((item) =>
            item.content ? (
              item.content.map((subItem) => (
                <Link
                  key={subItem.href}
                  to={subItem.disabled ? "#" : subItem.href}
                  className={cn(
                    "flex w-full items-center rounded-md p-2 text-sm font-medium hover:underline",
                    subItem.disabled && "cursor-not-allowed opacity-60",
                  )}
                >
                  {subItem.title}
                </Link>
              ))
            ) : (
              <Link
                key={item.href}
                to={item.disabled ? "#" : (item.href ?? "#")}
                className={cn(
                  "flex w-full items-center rounded-md p-2 text-sm font-medium hover:underline",
                  item.disabled && "cursor-not-allowed opacity-60",
                )}
              >
                {item.title}
              </Link>
            ),
          )}
        </nav>
        {children}
      </div>
    </div>
  );
};

export default MobileNav;
