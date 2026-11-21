/**
 * TransactionMobileSkeleton Component
 * Animated skeleton placeholders for stacked mobile cards.
 */

import { Skeleton } from "@/components/ui/skeleton";

export function TransactionMobileSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="w-full space-y-3" data-testid="transactions-mobile-skeleton">
      {Array.from({ length: count }).map((_, idx) => (
        <div
          // biome-ignore lint/suspicious/noArrayIndexKey: Static skeleton array
          key={`tx-mobile-skel-${idx}`}
          className="w-full rounded-[14px] border border-neutral-100 bg-white p-3.5 sm:p-4 shadow-2xs space-y-3"
        >
          {/* Top row */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <Skeleton className="size-8 rounded-full" />
              <div className="space-y-1">
                <Skeleton className="h-4 w-28 rounded-md" />
                <Skeleton className="h-3 w-16 rounded-md" />
              </div>
            </div>
            <Skeleton className="h-5 w-20 rounded-md" />
          </div>

          {/* Middle badges */}
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-18 rounded-full" />
            <Skeleton className="h-5 w-20 rounded-md" />
          </div>

          {/* Bottom row */}
          <div className="flex items-center justify-between pt-2 border-t border-neutral-100">
            <Skeleton className="h-5 w-16 rounded-full" />
            <Skeleton className="h-4 w-24 rounded-md" />
          </div>
        </div>
      ))}
    </div>
  );
}

