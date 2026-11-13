import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils/cn";

export interface AnalyticsSkeletonProps {
  className?: string;
  cardsCount?: number;
  showTable?: boolean;
}

export function AnalyticsSkeleton({
  className,
  cardsCount = 4,
  showTable = true,
}: AnalyticsSkeletonProps) {
  return (
    <div className={cn("space-y-6 animate-pulse", className)}>
      {/* KPI Cards Skeleton */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        {Array.from({ length: cardsCount }).map((_, i) => (
          <div
            // biome-ignore lint/suspicious/noArrayIndexKey: Static skeleton array
            key={i}
            className="rounded-2xl border border-[#eddcd4] bg-white p-4 sm:p-5 shadow-2xs"
          >
            <div className="flex items-center justify-between gap-2">
              <Skeleton className="h-3 w-24 bg-neutral-200" />
              <Skeleton className="size-8 rounded-xl bg-neutral-200" />
            </div>
            <div className="mt-3 space-y-2">
              <Skeleton className="h-7 w-32 bg-neutral-200" />
              <Skeleton className="h-4 w-20 rounded-full bg-neutral-100" />
            </div>
          </div>
        ))}
      </div>

      {/* Content Block Skeletons */}
      {showTable ? (
        <div className="rounded-2xl border border-[#eddcd4] bg-white p-5 sm:p-6 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <Skeleton className="h-5 w-48 bg-neutral-200" />
            <Skeleton className="h-4 w-24 bg-neutral-100" />
          </div>
          <div className="space-y-2.5 pt-2">
            {Array.from({ length: 5 }).map((_, i) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: Static skeleton array
              <Skeleton key={i} className="h-10 w-full rounded-lg bg-neutral-100" />
            ))}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="rounded-2xl border border-[#eddcd4] bg-white p-5 sm:p-6 shadow-2xs space-y-3">
            <Skeleton className="h-5 w-40 bg-neutral-200" />
            <Skeleton className="h-28 w-full rounded-xl bg-neutral-100" />
          </div>
          <div className="rounded-2xl border border-[#eddcd4] bg-white p-5 sm:p-6 shadow-2xs space-y-3">
            <Skeleton className="h-5 w-40 bg-neutral-200" />
            <Skeleton className="h-28 w-full rounded-xl bg-neutral-100" />
          </div>
        </div>
      )}
    </div>
  );
}
