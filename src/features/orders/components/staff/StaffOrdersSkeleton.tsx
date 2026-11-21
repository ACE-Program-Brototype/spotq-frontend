import { Skeleton } from "@/components/ui/skeleton";

interface StaffOrdersSkeletonProps {
  rowCount?: number;
}

export function StaffOrdersSkeleton({ rowCount = 5 }: StaffOrdersSkeletonProps) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rowCount }).map((_, index) => (
        <div
          // biome-ignore lint/suspicious/noArrayIndexKey: skeleton items
          key={index}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-neutral-100 bg-white"
        >
          <div className="space-y-2 flex-1">
            <div className="flex items-center gap-3">
              <Skeleton className="h-5 w-28 rounded-md bg-neutral-100" />
              <Skeleton className="h-5 w-20 rounded-full bg-neutral-100" />
              <Skeleton className="h-5 w-24 rounded-full bg-neutral-100" />
            </div>
            <Skeleton className="h-4 w-64 rounded bg-neutral-100" />
          </div>
          <div className="flex sm:flex-col items-end gap-2">
            <Skeleton className="h-4 w-20 rounded bg-neutral-100" />
            <Skeleton className="h-8 w-24 rounded-lg bg-neutral-100" />
          </div>
        </div>
      ))}
    </div>
  );
}
