import { Skeleton } from "@/components/ui/skeleton";

export function RestaurantProfileSkeleton() {
  return (
    <div className="space-y-6">
      {/* Overview Skeleton */}
      <div className="rounded-3xl border border-border/60 bg-card overflow-hidden p-6 space-y-6">
        <Skeleton className="h-48 w-full rounded-2xl bg-muted/60" />
        <div className="flex items-end justify-between -mt-16">
          <Skeleton className="size-24 rounded-2xl border-4 border-card bg-muted/80" />
          <Skeleton className="h-9 w-32 rounded-xl bg-muted/80" />
        </div>
        <div className="space-y-3">
          <Skeleton className="h-8 w-64 rounded-xl bg-muted/80" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Skeleton className="h-16 w-full rounded-2xl bg-muted/50" />
            <Skeleton className="h-16 w-full rounded-2xl bg-muted/50" />
          </div>
        </div>
      </div>

      {/* Info Skeleton */}
      <div className="rounded-3xl border border-border/60 bg-card p-6 space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-48 rounded-lg bg-muted/80" />
          <Skeleton className="h-9 w-28 rounded-xl bg-muted/80" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Skeleton className="h-20 w-full rounded-2xl bg-muted/50" />
          <Skeleton className="h-20 w-full rounded-2xl bg-muted/50" />
        </div>
        <Skeleton className="h-24 w-full rounded-2xl bg-muted/50" />
      </div>

      {/* Settings Skeleton */}
      <div className="rounded-3xl border border-border/60 bg-card p-6 space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-48 rounded-lg bg-muted/80" />
          <Skeleton className="h-9 w-32 rounded-xl bg-muted/80" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Skeleton className="h-16 w-full rounded-2xl bg-muted/50" />
          <Skeleton className="h-16 w-full rounded-2xl bg-muted/50" />
          <Skeleton className="h-16 w-full rounded-2xl bg-muted/50" />
          <Skeleton className="h-16 w-full rounded-2xl bg-muted/50" />
        </div>
      </div>
    </div>
  );
}

export default RestaurantProfileSkeleton;
