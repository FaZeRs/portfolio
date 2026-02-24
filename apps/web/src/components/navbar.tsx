import { useTheme } from "@acme/shared/theme-provider";
import { NavItem, UserType } from "@acme/types";
import { cn } from "@acme/ui";
import { useIsMobile } from "@acme/ui/hooks/use-mobile";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@acme/ui/navigation-menu";
import { Spinner } from "@acme/ui/spinner";
import { ThemeToggle } from "@acme/ui/theme";
import { Link, useLocation } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { Suspense, useState } from "react";
import { navbarLinks } from "~/lib/constants/navbar";
import { AvatarDropdown } from "./avatar-dropdown";
import SearchCommand from "./command-menu";
import MobileNav from "./mobile-nav";

interface MainNavbarProps {
  links: NavItem[];
  user: UserType;
}

const NavBar = ({ links, user }: Readonly<MainNavbarProps>) => {
  const [showMobileMenu, setShowMobileMenu] = useState<boolean>(false);
  const isMobile = useIsMobile();
  const { setTheme } = useTheme();

  const activeLink = useLocation({
    select: (location) =>
      links.find((link) => location.pathname.endsWith(link.href ?? "")),
  });

  return (
    <div className="flex flex-1 items-center justify-end gap-4 md:gap-6 lg:justify-between">
      <NavigationMenu className="hidden lg:flex" viewport={isMobile}>
        <NavigationMenuList className="gap-1">
          {links.map((link) => (
            <NavigationMenuItem key={link.title.trim()}>
              {link.content ? (
                <>
                  <NavigationMenuTrigger className="bg-transparent transition-colors hover:bg-muted/60">
                    {link.title}
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-2 p-3 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
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
                    "bg-transparent transition-all hover:bg-muted/60",
                    activeLink &&
                      link.href === activeLink.href &&
                      "bg-muted/80 font-semibold text-foreground",
                    link.disabled && "cursor-not-allowed opacity-60"
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

      {/* Desktop actions */}
      <div className="hidden items-center gap-2 lg:flex">
        {user && <AvatarDropdown user={user as UserType} />}
        <div className="flex items-center gap-1 rounded-full border border-border/50 bg-muted/30 p-1 backdrop-blur-sm">
          <Suspense fallback={<Spinner className="size-5" />}>
            <SearchCommand />
          </Suspense>
          <div className="h-4 w-px bg-border/50" />
          <Suspense fallback={<Spinner className="size-5" />}>
            <ThemeToggle setTheme={setTheme} />
          </Suspense>
        </div>
      </div>

      {/* Mobile menu button */}
      <button
        aria-label={showMobileMenu ? "Close menu" : "Open menu"}
        className={cn(
          "relative flex size-10 items-center justify-center rounded-xl border border-border/50 bg-muted/30 backdrop-blur-sm transition-all lg:hidden",
          "hover:border-border hover:bg-muted/50",
          "active:scale-95",
          showMobileMenu && "border-border bg-muted"
        )}
        onClick={() => setShowMobileMenu(!showMobileMenu)}
        type="button"
      >
        <span className="sr-only">
          {showMobileMenu ? "Close menu" : "Open menu"}
        </span>
        {showMobileMenu ? (
          <X className="size-5 transition-transform" />
        ) : (
          <Menu className="size-5 transition-transform" />
        )}
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
        <Link
          className="group block rounded-lg p-3 transition-colors hover:bg-muted/60"
          to={href}
        >
          <div className="mb-1 font-medium text-sm leading-none transition-colors group-hover:text-foreground">
            {title}
          </div>
          <p className="line-clamp-2 text-muted-foreground text-xs leading-relaxed">
            {children}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  );
}

export default NavBar;
