import { Link, useLocation } from "@tanstack/react-router";
import { Loader, Menu, X } from "lucide-react";
import { Suspense, useState } from "react";

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
import { NavItem, UserType } from "~/types";

import { AvatarDropdown } from "./avatar-dropdown";
import SearchCommand from "./command-menu";
import MobileNav from "./mobile-nav";

type MainNavbarProps = {
  links: NavItem[];
  user: UserType;
};

const NavBar = ({ links, user }: Readonly<MainNavbarProps>) => {
  const [showMobileMenu, setShowMobileMenu] = useState<boolean>(false);
  const activeLink = useLocation({
    select: (location) =>
      links.find((link) => location.pathname.endsWith(link.href ?? "")),
  });

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
                          href={subItem.href}
                          key={subItem.href.trim()}
                          title={subItem.title}
                        >
                          {subItem.description}
                        </ListItem>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </>
              ) : (
                <NavigationMenuLink
                  asChild
                  className={cn(
                    navigationMenuTriggerStyle(),
                    activeLink &&
                      link.href === activeLink.href &&
                      "bg-accent font-semibold",
                    link.disabled && "cursor-not-allowed opacity-80"
                  )}
                  target={link.href?.startsWith("http") ? "_blank" : "_self"}
                >
                  <Link to={link.href ?? "#"}>{link.title}</Link>
                </NavigationMenuLink>
              )}
            </NavigationMenuItem>
          ))}
        </NavigationMenuList>
      </NavigationMenu>

      <div className="hidden items-center gap-4 lg:flex">
        {user && <AvatarDropdown user={user as UserType} />}
        <div className="flex-1 sm:grow-0">
          <Suspense fallback={<Loader className="size-6 animate-spin" />}>
            <SearchCommand />
          </Suspense>
        </div>
        <Suspense fallback={<Loader className="size-6 animate-spin" />}>
          <ThemeToggle />
        </Suspense>
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
