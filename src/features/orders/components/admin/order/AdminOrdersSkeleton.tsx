/**
 * Platform Admin Orders Skeleton Component
 * Loading placeholders for table rows and metric cards during initial data fetch.
 */

import { Skeleton } from "@/components/ui/skeleton";

export function AdminOrdersSkeleton() {
  return (
    <div className="space-y-4" data-testid="admin-orders-skeleton">
      <div className="rounded-2xl border border-slate-200/80 bg-white shadow-xs overflow-hidden">
        {/* Table Header Placeholder */}
        <div className="border-b border-slate-100 bg-slate-50/50 p-4">
          <div className="grid grid-cols-8 gap-4 items-center">
            <Skeleton className="h-4 w-20 bg-slate-200" />
            <Skeleton className="h-4 w-28 bg-slate-200" />
            <Skeleton className="h-4 w-18 bg-slate-200" />
            <Skeleton className="h-4 w-22 bg-slate-200" />
            <Skeleton className="h-4 w-18 bg-slate-200" />
            <Skeleton className="h-4 w-20 bg-slate-200" />
            <Skeleton className="h-4 w-24 bg-slate-200" />
            <Skeleton className="h-4 w-12 bg-slate-200 justify-self-end" />
          </div>
        </div>

        {/* Table Rows Placeholder */}
        <div className="divide-y divide-slate-100">
          {Array.from({ length: 6 }).map((_, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: skeleton items
            <div key={i} className="p-4 grid grid-cols-8 gap-4 items-center">
              <Skeleton className="h-4 w-24 bg-slate-200" />
              <Skeleton className="h-4 w-32 bg-slate-200" />
              <Skeleton className="h-4 w-16 bg-slate-200" />
              <Skeleton className="h-6 w-20 rounded-full bg-slate-100" />
              <Skeleton className="h-6 w-16 rounded-full bg-slate-100" />
              <div className="space-y-1">
                <Skeleton className="h-4 w-16 bg-slate-200" />
                <Skeleton className="h-3 w-12 bg-slate-100" />
              </div>
              <Skeleton className="h-3 w-20 bg-slate-200" />
              <Skeleton className="h-8 w-8 rounded-lg bg-slate-100 justify-self-end" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
