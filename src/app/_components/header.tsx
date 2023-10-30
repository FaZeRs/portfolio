import Link from "next/link";
import NavLink from "./nav-link";

interface NavItem {
  name: string
  title: string
  href: string
  targetBlank?: boolean;
}

const navItems: NavItem[] = [
  {
    name: 'index',
    title: 'Home',
    href: "/"
  },
  {
    name: 'experience',
    title: 'Experience',
    href: "/experience"
  },
  {
    name: 'portfolio',
    title: 'Portfolio',
    href: "/portfolio"
  },
  {
    name: 'contact',
    title: 'Contact',
    href: "/contact"
  },
];

const Header = () => {
  return (
    <nav className="top-0 sticky z-40 shadow-lg bg-white dark:bg-slate-800">
      <div
        className="
          container
          h-16
          flex flex-row
          px-8
          justify-between
          items-center
          mx-auto
        "
      >
        <Link href="/" className="flex items-center space-x-7">
          <span
            className="
              self-center
              text-3xl
              font-semibold
              whitespace-nowrap
              text-slate-800
              dark:text-white
            "
          >{"{Portfolio}"}</span>
        </Link>
        <ul className="hidden md:flex flex-row self-end h-10 space-x-7 text-slate-700 dark:text-slate-300">
          {navItems.map((link) => (
            <li key={link.name}>
              <NavLink href={link.href}>
                {link.title}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default Header;