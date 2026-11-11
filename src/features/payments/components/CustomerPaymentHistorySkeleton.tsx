/**
 * CustomerPaymentHistorySkeleton Component
 * Accessible loading skeleton placeholders for both desktop table and mobile cards.
 */

import { Skeleton } from "@/components/ui/skeleton";

export function CustomerPaymentHistorySkeleton() {
  return (
    <div data-testid="customer-payment-history-skeleton" className="flex flex-col gap-4 w-full">
      {/* Desktop Table Skeleton */}
      <div className="hidden md:block w-full rounded-2xl border border-neutral-200/80 bg-white overflow-hidden shadow-xs">
        <div className="h-12 bg-neutral-50/70 border-b border-neutral-200/80 px-4 flex items-center justify-between">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-20" />
        </div>
        <div className="divide-y divide-neutral-100 p-2">
          {["row-1", "row-2", "row-3", "row-4", "row-5"].map((id) => (
            <div key={id} className="flex items-center justify-between p-3.5 gap-4">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-6 w-24 rounded-xl" />
              <Skeleton className="h-6 w-20 rounded-full" />
              <Skeleton className="h-8 w-28 rounded-xl" />
            </div>
          ))}
        </div>
      </div>

      {/* Mobile Cards Skeleton */}
      <div className="flex md:hidden flex-col gap-3 w-full">
        {["card-1", "card-2", "card-3", "card-4"].map((id) => (
          <div
            key={id}
            className="flex flex-col gap-3 p-4 rounded-2xl bg-white border border-neutral-200/80 shadow-2xs"
          >
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-5 w-16 rounded-full" />
            </div>
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-5 w-20" />
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-neutral-100">
              <Skeleton className="h-6 w-24 rounded-xl" />
              <Skeleton className="h-8 w-28 rounded-xl" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
