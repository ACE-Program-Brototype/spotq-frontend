import { Skeleton } from "@/components/ui/skeleton";

export function RestaurantCardSkeleton() {
  return (
    <div
      data-slot="restaurant-card-skeleton"
      className="flex flex-col overflow-hidden rounded-2xl border border-neutral-200/80 bg-white shadow-2xs"
    >
      <Skeleton className="aspect-4/3 w-full bg-neutral-200/70" />
      <div className="flex flex-1 flex-col justify-between p-4 space-y-3">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-32 bg-neutral-200/70" />
            <Skeleton className="h-3 w-16 bg-neutral-200/70" />
          </div>
          <Skeleton className="h-3 w-24 bg-neutral-200/70" />
          <Skeleton className="h-3 w-20 bg-neutral-200/70" />
        </div>
        <div className="pt-2">
          <Skeleton className="h-4 w-24 bg-neutral-200/70" />
        </div>
      </div>
    </div>
  );
}
