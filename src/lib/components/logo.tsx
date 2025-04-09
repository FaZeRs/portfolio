import { Link } from "@tanstack/react-router";
import { siteConfig } from "~/lib/config/site";

const Logo = () => {
  return (
    <Link to="/" className="relative flex items-center">
      <span className="font-mono text-lg font-bold lowercase">{`${siteConfig.name}.dev()`}</span>
    </Link>
  );
};

export default Logo;
