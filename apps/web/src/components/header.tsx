import Logo from "@acme/shared/logo";
import { NavItem, UserType } from "@acme/types";
import Navbar from "./navbar";

export function Header({
  links,
  user,
}: Readonly<{ links: NavItem[]; user: UserType }>) {
  return (
    <header className="sticky top-0 z-40 w-full">
      {/* Glass morphism background */}
      <div className="absolute inset-0 border-border/40 border-b bg-background/70 backdrop-blur-xl" />

      {/* Subtle gradient glow at the top */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-foreground/10 to-transparent" />

      {/* Decorative accent line at bottom */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-linear-to-r from-transparent via-violet-500/20 to-transparent" />

      <div className="container relative lg:max-w-4xl xl:max-w-6xl 2xl:max-w-7xl">
        <div className="flex h-16 items-center justify-between gap-6 sm:h-18 md:h-20">
          <Logo className="transition-opacity hover:opacity-80" />
          <Navbar links={links} user={user} />
        </div>
      </div>
    </header>
  );
}
