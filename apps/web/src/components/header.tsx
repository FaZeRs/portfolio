import Logo from "@acme/shared/logo";
import { NavItem, UserType } from "@acme/types";
import Navbar from "./navbar";

export function Header({
  links,
  user,
}: Readonly<{ links: NavItem[]; user: UserType }>) {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/90 backdrop-blur-md">
      <div className="container lg:max-w-4xl xl:max-w-6xl 2xl:max-w-7xl">
        <div className="flex h-20 items-center space-x-8 py-6">
          <Logo />
          <Navbar links={links} user={user} />
        </div>
      </div>
    </header>
  );
}
