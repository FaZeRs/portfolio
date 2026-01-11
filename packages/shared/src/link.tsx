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
    <TanstackLink rel="noopener noreferrer" target="_blank" to={url}>
      <div className="group flex cursor-pointer items-center gap-x-2 rounded-xl border border-border/50 bg-card/50 px-4 py-2.5 font-medium text-foreground text-sm backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:border-foreground/20 hover:bg-card hover:shadow-lg dark:bg-white/5 dark:hover:bg-white/10">
        <span className="transition-transform duration-300 group-hover:scale-110">
          {icon}
        </span>
        {title}
      </div>
    </TanstackLink>
  );
}
