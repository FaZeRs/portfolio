import { Link as TanstackLink } from "@tanstack/react-router";
import type { ReactNode } from "react";

type ProjectLinksProps = {
  title: string;
  url: string;
  icon?: ReactNode;
};

export default function Link({
  title,
  url,
  icon,
}: Readonly<ProjectLinksProps>) {
  return (
    <TanstackLink target="_blank" to={url}>
      <div className="flex cursor-pointer items-center gap-x-2 rounded-md border border-transparent bg-white px-4 py-2 text-zinc-700 duration-200 hover:border-zinc-200 dark:bg-white/10 dark:text-white hover:dark:border-zinc-700">
        {icon}
        {title}
      </div>
    </TanstackLink>
  );
}
