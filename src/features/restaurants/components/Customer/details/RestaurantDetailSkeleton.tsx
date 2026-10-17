import { Skeleton } from "@/components/ui/skeleton";

export function RestaurantDetailSkeleton() {
  return (
    <div className="min-h-screen bg-neutral-50 pb-20 animate-pulse">
      {/* 1. Hero Skeleton Banner */}
      <div className="h-64 sm:h-80 md:h-96 w-full bg-neutral-200" />

      {/* 2. Overlapping Card Skeleton */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="-mt-20 relative z-10 rounded-2xl border border-neutral-200 bg-white p-6 md:p-8 shadow-lg space-y-4">
          {/* Status pills */}
          <div className="flex gap-2">
            <Skeleton className="h-5 w-20 rounded-full" />
            <Skeleton className="h-5 w-28 rounded-full" />
          </div>

          {/* Title & Address */}
          <div className="space-y-2">
            <Skeleton className="h-8 w-64 max-w-full" />
            <Skeleton className="h-4 w-44" />
          </div>

          {/* Cuisines & Avg Cost */}
          <div className="flex gap-2 pt-1">
            <Skeleton className="h-5 w-16 rounded-md" />
            <Skeleton className="h-5 w-20 rounded-md" />
            <Skeleton className="h-5 w-24 rounded-md" />
          </div>
        </div>

        {/* 3. Navigation Tabs Skeleton */}
        <div className="flex gap-8 border-b border-neutral-200 pt-8 pb-3">
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-5 w-28" />
          <Skeleton className="h-5 w-16" />
        </div>

        {/* 4. Filter bar skeleton */}
        <div className="flex items-center justify-between gap-4 pt-6">
          <Skeleton className="h-10 w-64 max-w-full rounded-xl" />
          <Skeleton className="h-9 w-24 rounded-xl" />
        </div>

        {/* 5. Menu Items Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6">
          {[1, 2, 3, 4].map((n) => (
            <div
              key={n}
              className="flex items-center justify-between gap-4 rounded-xl border border-neutral-200 bg-white p-4"
            >
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-4 rounded-sm" />
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-3 w-48" />
              </div>
              <Skeleton className="size-24 rounded-xl shrink-0" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
