/**
 * Staff Menu Item Skeleton Component
 * Displays animated skeleton placeholders during loading.
 */

import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils/cn";

export interface StaffMenuItemSkeletonProps {
  viewMode?: "grid" | "table";
  count?: number;
  className?: string;
}

export function StaffMenuItemSkeleton({
  viewMode = "table",
  count = 6,
  className,
}: StaffMenuItemSkeletonProps) {
  const items = Array.from({ length: count }, (_, i) => `item-${i + 1}`);

  if (viewMode === "table") {
    return (
      <div className={cn("space-y-3 p-4", className)}>
        {items.map((itemKey) => (
          <div
            key={`table-${itemKey}`}
            className="flex items-center justify-between gap-4 py-3 border-b border-neutral-100"
          >
            <div className="flex items-center gap-3 flex-1">
              <Skeleton className="size-10 rounded-xl" />
              <div className="space-y-1.5 flex-1">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
            <Skeleton className="h-6 w-24 rounded-lg" />
            <Skeleton className="h-5 w-16" />
            <Skeleton className="h-6 w-20 rounded-full" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div
      data-testid="staff-menu-skeleton-grid"
      className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4", className)}
    >
      {items.map((itemKey) => (
        <div
          key={`grid-${itemKey}`}
          className="rounded-2xl border border-[#eddcd4] bg-white p-5 space-y-4"
        >
          <div className="flex items-center justify-between">
            <Skeleton className="h-5 w-24 rounded-lg" />
            <Skeleton className="h-5 w-20 rounded-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-2/3" />
          </div>
          <div className="flex items-center justify-between pt-3 border-t border-[#f3e6de]">
            <Skeleton className="h-6 w-16" />
            <Skeleton className="h-4 w-28" />
          </div>
        </div>
      ))}
    </div>
  );
}
