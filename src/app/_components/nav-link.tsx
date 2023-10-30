'use client';

import { type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from 'next/navigation';

interface NavLinkProps {
  href: string;
  children: ReactNode;
}

const NavLink = ({ href, children }: NavLinkProps) => {
  const pathname = usePathname();
  const isActive = pathname === href;
  const activeClassName = 'dark:text-white text-indigo-700 border-b-2 border-indigo-700'
  const className = 'font-header hover:text-indigo-700 dark:hover:text-white cursor-pointer font-medium tracking-wide flex items-start justify-center h-full px-2' + ' ' + (isActive ? activeClassName : '')
  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
};

export default NavLink;