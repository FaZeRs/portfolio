import { Link } from "@tanstack/react-router";
import { siteConfig } from "~/lib/config/site";
import { cn } from "../utils";

const Logo = ({ className }: { className?: string }) => {
  return (
    <Link to="/" className={cn("relative flex items-center", className)}>
      <span className="font-mono text-lg font-bold lowercase">{`${siteConfig.name}.dev()`}</span>
    </Link>
  );
};

export default Logo;
