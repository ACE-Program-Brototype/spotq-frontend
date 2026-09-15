import { Skeleton } from "@/components/ui/skeleton";

export function RestaurantProfileSkeleton() {
  return (
    <div className="space-y-6">
      {/* Overview Skeleton */}
      <div className="rounded-3xl border border-[#eddcd4] bg-white overflow-hidden p-6 space-y-6">
        <Skeleton className="h-48 w-full rounded-2xl bg-neutral-100" />
        <div className="flex items-end justify-between -mt-16">
          <Skeleton className="size-24 rounded-2xl border-4 border-white bg-neutral-200" />
          <Skeleton className="h-9 w-32 rounded-xl bg-neutral-200" />
        </div>
        <div className="space-y-3">
          <Skeleton className="h-8 w-64 rounded-xl bg-neutral-200" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Skeleton className="h-16 w-full rounded-2xl bg-neutral-100" />
            <Skeleton className="h-16 w-full rounded-2xl bg-neutral-100" />
          </div>
        </div>
      </div>

      {/* Info Skeleton */}
      <div className="rounded-3xl border border-[#eddcd4] bg-white p-6 space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-48 rounded-lg bg-neutral-200" />
          <Skeleton className="h-9 w-28 rounded-xl bg-neutral-200" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Skeleton className="h-20 w-full rounded-2xl bg-neutral-100" />
          <Skeleton className="h-20 w-full rounded-2xl bg-neutral-100" />
        </div>
        <Skeleton className="h-24 w-full rounded-2xl bg-neutral-100" />
      </div>

      {/* Settings Skeleton */}
      <div className="rounded-3xl border border-[#eddcd4] bg-white p-6 space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-48 rounded-lg bg-neutral-200" />
          <Skeleton className="h-9 w-32 rounded-xl bg-neutral-200" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Skeleton className="h-16 w-full rounded-2xl bg-neutral-100" />
          <Skeleton className="h-16 w-full rounded-2xl bg-neutral-100" />
          <Skeleton className="h-16 w-full rounded-2xl bg-neutral-100" />
          <Skeleton className="h-16 w-full rounded-2xl bg-neutral-100" />
        </div>
      </div>
    </div>
  );
}
