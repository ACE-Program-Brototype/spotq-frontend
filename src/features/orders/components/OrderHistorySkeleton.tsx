/**
 * OrderHistorySkeleton Component
 * Animated skeleton loader matching the modern order card grid.
 */

import { Skeleton } from "@/components/ui/skeleton";

export function OrderHistorySkeleton() {
  return (
    <div data-testid="order-history-skeleton" className="grid grid-cols-1 xl:grid-cols-2 gap-4">
      {[1, 2, 3, 4].map((key) => (
        <div
          key={key}
          className="flex flex-col justify-between rounded-3xl bg-white p-5 sm:p-6 border border-neutral-200/80 shadow-xs space-y-4 select-none"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-3.5 border-b border-neutral-100">
            <div className="flex items-center gap-3.5">
              <Skeleton className="size-11 rounded-2xl" />
              <div className="space-y-1.5">
                <Skeleton className="h-4.5 w-36 sm:w-44 rounded-md" />
                <Skeleton className="h-3 w-24 rounded-md" />
              </div>
            </div>
            <Skeleton className="h-6.5 w-24 rounded-full" />
          </div>

          {/* Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <Skeleton className="h-9 w-full rounded-xl" />
            <Skeleton className="h-9 w-full rounded-xl" />
          </div>

          {/* Footer */}
          <div className="flex items-end justify-between pt-3.5 border-t border-neutral-100">
            <div className="space-y-1">
              <Skeleton className="h-2.5 w-16 rounded-md" />
              <Skeleton className="h-6 w-24 rounded-md" />
            </div>
            <Skeleton className="h-6 w-24 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default OrderHistorySkeleton;
