import { siteConfig } from "@acme/config";
import { cn } from "@acme/ui";
import { Link } from "@tanstack/react-router";

const Logo = ({ className }: { className?: string }) => (
  <Link className={cn("relative flex items-center", className)} to="/">
    <span className="font-bold font-mono text-lg lowercase">{`${siteConfig.name}.dev()`}</span>
  </Link>
);

export default Logo;
