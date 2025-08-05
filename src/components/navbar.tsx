import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useState } from "react";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "~/components/ui/navigation-menu";
import { ThemeToggle } from "~/components/ui/theme";
import { navbarLinks } from "~/lib/config/navbar";
import { cn } from "~/lib/utils";
import { NavItem } from "~/types";

import { AvatarDropdown } from "./avatar-dropdown";
import SearchCommand from "./command-menu";
import MobileNav from "./mobile-nav";

interface MainNavbarProps {
  links: NavItem[];
}

const NavBar = ({ links }: Readonly<MainNavbarProps>) => {
  const [showMobileMenu, setShowMobileMenu] = useState<boolean>(false);
  const { location } = useRouterState();
  const pathSegments = location.pathname.split("/").filter(Boolean);
  const lastSegment =
    pathSegments.length > 0 ? pathSegments[pathSegments.length - 1] : "";

  return (
    <div className="flex flex-1 justify-end gap-6 md:gap-10 lg:justify-between">
      <NavigationMenu className="hidden lg:flex">
        <NavigationMenuList>
          {links.map((link) => (
            <NavigationMenuItem key={link.title.trim()}>
              {link.content ? (
                <>
                  <NavigationMenuTrigger>{link.title}</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                      {link.content.map((subItem) => (
                        <ListItem
                          key={subItem.href.trim()}
                          title={subItem.title}
                          href={subItem.href}
                        >
                          {subItem.description}
                        </ListItem>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </>
              ) : (
                <NavigationMenuLink
                  target={link.href?.startsWith("http") ? "_blank" : "_self"}
                  className={cn(
                    navigationMenuTriggerStyle(),
                    lastSegment &&
                      link.href?.endsWith(`/${lastSegment}`) &&
                      "bg-accent font-semibold",
                    link.disabled && "cursor-not-allowed opacity-80",
                  )}
                  asChild
                >
                  <Link to={link.href ?? "#"}>{link.title}</Link>
                </NavigationMenuLink>
              )}
            </NavigationMenuItem>
          ))}
        </NavigationMenuList>
      </NavigationMenu>

      <div className="hidden items-center gap-4 lg:flex">
        <AvatarDropdown />
        <div className="flex-1 sm:grow-0">
          <SearchCommand />
        </div>
        <ThemeToggle />
      </div>

      <button
        className="flex items-center space-x-2 lg:hidden"
        onClick={() => setShowMobileMenu(!showMobileMenu)}
        type="button"
      >
        {showMobileMenu ? <X /> : <Menu />}
      </button>

      {showMobileMenu && (
        <MobileNav
          items={navbarLinks}
          onItemClick={() => setShowMobileMenu(false)}
        />
      )}
    </div>
  );
};

function ListItem({
  title,
  children,
  href,
  ...props
}: React.ComponentPropsWithoutRef<"li"> & { href: string }) {
  return (
    <li {...props}>
      <NavigationMenuLink asChild>
        <Link to={href}>
          <div className="font-medium text-sm leading-none">{title}</div>
          <p className="line-clamp-2 text-muted-foreground text-sm leading-snug">
            {children}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  );
}

export default NavBar;
