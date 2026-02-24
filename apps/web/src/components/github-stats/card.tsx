import { Skeleton } from "@acme/ui/skeleton";
import { ExternalLink } from "lucide-react";
import Counter from "~/components/counter";

interface StatCardProps {
  card: { title: string; description?: string; link?: string; value?: number };
}

export default function StatCard({ card }: StatCardProps) {
  const { title, description, value, link } = card;

  return (
    <a
      className="group relative flex flex-col overflow-hidden rounded-2xl border bg-card p-6 transition-all duration-300 hover:border-foreground/20 hover:shadow-xl"
      href={link}
      rel="noreferrer"
      target="_blank"
    >
      {/* Hover gradient overlay */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-violet-500/5 via-transparent to-cyan-500/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      {/* External link indicator */}
      <div className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full border bg-background opacity-0 transition-all group-hover:opacity-100">
        <ExternalLink size={14} />
      </div>

      <div className="relative">
        <div className="font-bold text-4xl tracking-tight">
          {value ? (
            <Counter value={value} />
          ) : (
            <Skeleton className="h-10 w-20 rounded-lg" />
          )}
        </div>

        <h3 className="mt-2 font-semibold">{title}</h3>
        {description && (
          <p className="mt-1 text-muted-foreground text-sm">{description}</p>
        )}
      </div>
    </a>
  );
}
