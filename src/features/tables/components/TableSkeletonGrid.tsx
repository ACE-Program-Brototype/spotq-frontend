import { Skeleton } from "@/components/ui/skeleton";

export function TableSkeletonGrid({ count = 10 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 min-[420px]:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3.5 sm:gap-4 animate-pulse">
      {Array.from({ length: count }).map((_, index) => (
        <div
          // biome-ignore lint/suspicious/noArrayIndexKey: Skeleton placeholders
          key={`skeleton-card-${index}`}
          className="flex flex-col justify-between h-28 rounded-2xl p-4 bg-card border border-border/60 shadow-2xs"
        >
          <div className="flex items-center justify-between">
            <Skeleton className="h-6 w-12 rounded-md bg-muted/80" />
            <Skeleton className="h-5 w-20 rounded-full bg-muted/60" />
          </div>
          <div className="flex items-center justify-between pt-2">
            <Skeleton className="h-4 w-16 rounded bg-muted/60" />
            <Skeleton className="h-3 w-10 rounded bg-muted/40" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default TableSkeletonGrid;
