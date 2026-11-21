/**
 * TransactionsSkeleton Component
 * Placeholder skeleton loaders for table rows and drawer content.
 */

import { Skeleton } from "@/components/ui/skeleton";

const SKELETON_ROW_KEYS = [
  "tx-skel-1",
  "tx-skel-2",
  "tx-skel-3",
  "tx-skel-4",
  "tx-skel-5",
  "tx-skel-6",
  "tx-skel-7",
  "tx-skel-8",
  "tx-skel-9",
  "tx-skel-10",
];

export function TransactionsTableSkeleton({ rowCount = 5 }: { rowCount?: number }) {
  const keys = SKELETON_ROW_KEYS.slice(0, Math.min(rowCount, SKELETON_ROW_KEYS.length));

  return (
    <div className="w-full space-y-3" data-testid="transactions-table-skeleton">
      {keys.map((key) => (
        <div
          key={key}
          className="flex items-center justify-between p-4 border border-neutral-100 rounded-xl bg-white/50"
        >
          <div className="flex items-center gap-4">
            <Skeleton className="h-5 w-32 rounded-md" />
            <Skeleton className="h-5 w-24 rounded-full" />
            <Skeleton className="h-5 w-28 rounded-md" />
          </div>
          <div className="flex items-center gap-6">
            <Skeleton className="h-5 w-16 rounded-full" />
            <Skeleton className="h-5 w-20 rounded-md" />
            <Skeleton className="h-5 w-20 rounded-full" />
            <Skeleton className="h-8 w-24 rounded-lg" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function TransactionDrawerSkeleton() {
  return (
    <div className="p-6 space-y-6" data-testid="transaction-drawer-skeleton">
      <div className="flex items-center justify-between">
        <Skeleton className="h-6 w-32 rounded-md" />
        <Skeleton className="h-5 w-20 rounded-full" />
      </div>

      <div className="space-y-2">
        <Skeleton className="h-4 w-40 rounded-md" />
        <Skeleton className="h-8 w-full rounded-lg" />
      </div>

      <div className="p-4 border border-neutral-100 rounded-xl space-y-3">
        <Skeleton className="h-4 w-32 rounded-md" />
        <Skeleton className="h-5 w-48 rounded-md" />
        <Skeleton className="h-5 w-40 rounded-md" />
      </div>

      <div className="p-4 border border-neutral-100 rounded-xl space-y-3">
        <Skeleton className="h-4 w-36 rounded-md" />
        <Skeleton className="h-5 w-full rounded-md" />
        <Skeleton className="h-5 w-full rounded-md" />
        <Skeleton className="h-6 w-full rounded-md" />
      </div>

      <div className="p-4 border border-neutral-100 rounded-xl space-y-3">
        <Skeleton className="h-4 w-44 rounded-md" />
        <Skeleton className="h-5 w-full rounded-md" />
        <Skeleton className="h-5 w-full rounded-md" />
      </div>
    </div>
  );
}
