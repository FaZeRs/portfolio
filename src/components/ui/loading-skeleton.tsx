export default function LoadingSkeleton() {
  return (
    <div className="before:-translate-x-full relative isolate space-y-5 overflow-hidden rounded-2xl bg-white/5 p-4 shadow-black/5 shadow-xl before:absolute before:inset-0 before:animate-[shimmer_2s_infinite] before:border-gray-600/10 before:border-t before:bg-gradient-to-r before:from-transparent before:via-gray-600/10 before:to-transparent dark:before:border-rose-100/10 dark:before:via-rose-100/10">
      <div className="h-24 rounded-lg bg-gray-200/80 dark:bg-rose-100/10" />
      <div className="space-y-3">
        <div className="h-3 w-3/5 rounded-lg bg-gray-200/80 dark:bg-rose-100/10" />
        <div className="h-3 w-4/5 rounded-lg bg-gray-200/70 dark:bg-rose-100/20" />
        <div className="h-3 w-2/5 rounded-lg bg-gray-200/70 dark:bg-rose-100/20" />
      </div>
    </div>
  );
}
