import { Link } from "@tanstack/react-router";
import { siteConfig } from "~/lib/config/site";
import { cn } from "../lib/utils";

const Logo = ({ className }: { className?: string }) => {
  return (
    <Link className={cn("relative flex items-center", className)} to="/">
      <span className="font-bold font-mono text-lg lowercase">{`${siteConfig.name}.dev()`}</span>
    </Link>
  );
};

export default Logo;
