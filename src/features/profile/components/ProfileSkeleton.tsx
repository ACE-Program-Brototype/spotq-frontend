import { Skeleton } from "@/components/ui/skeleton";

export function ProfileSkeleton() {
  return (
    <div
      role="status"
      className="flex flex-col gap-6 w-full animate-pulse"
      aria-label="Loading profile..."
    >
      {/* Hero Card Skeleton */}
      <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8 rounded-3xl bg-white p-6 sm:p-8 border border-neutral-200/80 shadow-xs">
        <Skeleton className="size-28 sm:size-32 rounded-full bg-neutral-200 shrink-0" />
        <div className="flex flex-col items-center sm:items-start gap-3 w-full max-w-sm">
          <Skeleton className="h-8 w-48 rounded-lg bg-neutral-200" />
          <Skeleton className="h-4 w-32 rounded-md bg-neutral-200" />
          <div className="flex gap-2 pt-1">
            <Skeleton className="h-6 w-24 rounded-full bg-neutral-200" />
            <Skeleton className="h-6 w-28 rounded-full bg-neutral-200" />
          </div>
        </div>
      </div>

      {/* 4 Info Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton placeholder
            key={i}
            className="flex items-center gap-4 rounded-2xl bg-white p-4 sm:p-5 border border-neutral-200/80 shadow-xs"
          >
            <Skeleton className="size-11 rounded-xl bg-neutral-200 shrink-0" />
            <div className="flex flex-col gap-1.5 w-full">
              <Skeleton className="h-3 w-16 rounded-xs bg-neutral-200" />
              <Skeleton className="h-4 w-28 rounded-sm bg-neutral-200" />
            </div>
          </div>
        ))}
      </div>

      {/* Delivery Map Card Skeleton */}
      <div className="overflow-hidden rounded-3xl bg-white border border-neutral-200/80 shadow-xs">
        <Skeleton className="h-48 sm:h-56 w-full bg-neutral-200" />
        <div className="bg-neutral-100 py-3 px-4 flex justify-center">
          <Skeleton className="h-4 w-44 rounded-sm bg-neutral-200" />
        </div>
      </div>
    </div>
  );
}
