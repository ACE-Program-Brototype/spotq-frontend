import { Skeleton } from "@/components/ui/skeleton";

export function StaffOrderDetailSkeleton() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10 animate-pulse">
      {/* Back button skeleton */}
      <Skeleton className="h-4 w-28 rounded-md" />

      {/* Header skeleton */}
      <div className="rounded-2xl border border-neutral-200/80 bg-white p-6 shadow-xs space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <Skeleton className="h-8 w-36 rounded-xl" />
              <Skeleton className="h-6 w-20 rounded-full" />
              <Skeleton className="h-6 w-24 rounded-full" />
            </div>
            <Skeleton className="h-4 w-48 rounded-md" />
          </div>
          <Skeleton className="h-10 w-36 rounded-xl" />
        </div>
      </div>

      {/* 2-Column layout skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Column (Items & Notes) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between px-1">
            <Skeleton className="h-5 w-32 rounded-md" />
            <Skeleton className="h-4 w-20 rounded-md" />
          </div>

          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="rounded-2xl border border-neutral-200/80 bg-white p-5 shadow-xs flex gap-4"
            >
              <Skeleton className="size-11 rounded-2xl shrink-0" />
              <div className="flex-1 space-y-2.5">
                <Skeleton className="h-5 w-48 rounded-md" />
                <Skeleton className="h-4 w-28 rounded-md" />
                <Skeleton className="h-12 w-full rounded-xl" />
              </div>
            </div>
          ))}

          <Skeleton className="h-20 w-full rounded-2xl" />
        </div>

        {/* Right Column (Action bar & Summary) */}
        <div className="space-y-5">
          <Skeleton className="h-36 w-full rounded-2xl" />
          <Skeleton className="h-48 w-full rounded-2xl" />
        </div>
      </div>
    </div>
  );
}
