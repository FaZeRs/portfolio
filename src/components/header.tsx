import { NavItem, UserType } from "~/types";
import Logo from "./logo";
import Navbar from "./navbar";

export function Header({
  links,
  user,
}: Readonly<{ links: NavItem[]; user: UserType }>) {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/90 backdrop-blur-md">
      <div className="container lg:max-w-4xl xl:max-w-6xl">
        <div className="flex h-20 items-center space-x-8 py-6">
          <Logo />
          <Navbar links={links} user={user} />
        </div>
      </div>
    </header>
  );
}
