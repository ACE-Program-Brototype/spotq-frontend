import type React from "react";
import { Skeleton } from "@/components/ui/skeleton";

interface OrderDetailsSkeletonProps {
  count?: number;
}

export const OrderDetailsSkeleton: React.FC<OrderDetailsSkeletonProps> = ({ count = 2 }) => {
  const items = Array.from({ length: count }, (_, i) => `skeleton-item-${i}`);

  return (
    <div className="space-y-4 py-2" data-testid="order-details-skeleton">
      {items.map((id) => (
        <div key={id} className="flex items-center gap-4">
          <Skeleton className="h-16 w-16 rounded-xl shrink-0" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-3/4 rounded-md" />
            <Skeleton className="h-3 w-1/2 rounded-md" />
          </div>
          <Skeleton className="h-6 w-16 rounded-md shrink-0" />
        </div>
      ))}
    </div>
  );
};
