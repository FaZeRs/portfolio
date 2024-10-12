import Link from "next/link";

import { siteConfig } from "~/config/site";

const Logo = () => {
  return (
    <Link href="/" className="relative flex items-center">
      <span className="font-mono text-lg font-bold lowercase">{`${siteConfig.name}.dev()`}</span>
    </Link>
  );
};

export default Logo;
