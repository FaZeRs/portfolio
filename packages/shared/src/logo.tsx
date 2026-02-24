import { siteConfig } from "@acme/config";
import { cn } from "@acme/ui";
import { Link } from "@tanstack/react-router";

const Logo = ({ className }: { className?: string }) => (
  <Link
    className={cn(
      "group relative flex items-center gap-2.5 outline-none",
      className
    )}
    to="/"
  >
    {/* Animated icon mark */}
    <span className="relative flex size-9 items-center justify-center">
      {/* Glow effect */}
      <span className="absolute inset-0 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 opacity-0 blur-lg transition-opacity duration-500 group-hover:opacity-60 group-focus-visible:opacity-60" />

      {/* Icon container */}
      <span className="relative flex size-9 items-center justify-center rounded-xl border border-white/10 bg-gradient-to-br from-zinc-900 to-zinc-800 shadow-black/20 shadow-lg ring-1 ring-white/5 ring-inset transition-transform duration-300 group-hover:scale-105 group-focus-visible:scale-105 dark:from-zinc-800 dark:to-zinc-900">
        {/* Animated brackets */}
        <span className="relative flex items-center font-mono text-sm tracking-tighter">
          <span className="text-violet-400 transition-transform duration-300 group-hover:-translate-x-0.5">
            &lt;
          </span>
          <span className="bg-gradient-to-b from-white to-zinc-400 bg-clip-text text-transparent">
            /
          </span>
          <span className="text-fuchsia-400 transition-transform duration-300 group-hover:translate-x-0.5">
            &gt;
          </span>
        </span>
      </span>
    </span>

    {/* Text mark */}
    <span className="flex items-baseline gap-0.5">
      <span className="bg-gradient-to-r from-zinc-900 via-zinc-700 to-zinc-800 bg-clip-text font-semibold text-base text-transparent tracking-tight transition-all dark:from-white dark:via-zinc-200 dark:to-zinc-400">
        {siteConfig.name}
      </span>
      <span className="font-mono text-sm text-zinc-400 transition-colors group-hover:text-violet-500 dark:text-zinc-500 dark:group-hover:text-violet-400">
        .dev
      </span>
    </span>
  </Link>
);

export default Logo;
