import type React from "react";
import { Skeleton } from "@/components/ui/skeleton";

interface OrderDetailsSkeletonProps {
  count?: number;
}

export const OrderDetailsSkeleton: React.FC<OrderDetailsSkeletonProps> = ({ count = 2 }) => {
  const items = Array.from({ length: count }, (_, i) => `skeleton-item-${i}`);

  return (
    <div className="space-y-2 py-0.5" data-testid="order-details-skeleton">
      {items.map((id) => (
        <div key={id} className="flex items-center gap-2.5">
          <Skeleton className="size-10 sm:size-11 rounded-md shrink-0" />
          <div className="flex-1 space-y-1">
            <Skeleton className="h-3 w-3/4 rounded-sm" />
            <Skeleton className="h-2.5 w-1/2 rounded-sm" />
          </div>
          <Skeleton className="h-4 w-12 rounded-sm shrink-0" />
        </div>
      ))}
    </div>
  );
};

