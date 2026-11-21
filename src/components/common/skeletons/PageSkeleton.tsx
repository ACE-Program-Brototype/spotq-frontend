import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils/cn";

export interface PageSkeletonProps {
  layout?: "table" | "cards" | "form" | "detail";
  className?: string;
}

export function PageSkeleton({ layout = "cards", className }: PageSkeletonProps) {
  const cardKeys = Array.from({ length: 8 }, (_, i) => `page-card-${i}`);
  const tableRowKeys = Array.from({ length: 6 }, (_, i) => `page-table-${i}`);

  return (
    <div data-slot="page-skeleton" className={cn("space-y-6 p-6", className)}>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1.5">
          <Skeleton className="h-8 w-48 bg-muted/80" />
          <Skeleton className="h-4 w-72 bg-muted/60" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-10 w-28 rounded-lg bg-muted/70" />
        </div>
      </div>

      <div className="flex items-center justify-between gap-4">
        <Skeleton className="h-10 w-64 rounded-lg bg-muted/60" />
        <div className="flex gap-2">
          <Skeleton className="h-10 w-24 rounded-lg bg-muted/60" />
          <Skeleton className="h-10 w-24 rounded-lg bg-muted/60" />
        </div>
      </div>

      {layout === "cards" && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {cardKeys.map((key) => (
            <div
              key={key}
              className="h-64 rounded-2xl border border-border/60 bg-card p-4 space-y-3"
            >
              <Skeleton className="h-32 w-full rounded-xl bg-muted/70" />
              <Skeleton className="h-4 w-3/4 bg-muted/80" />
              <Skeleton className="h-3 w-1/2 bg-muted/50" />
            </div>
          ))}
        </div>
      )}

      {layout === "table" && (
        <div className="rounded-xl border border-border/60 bg-card p-4 space-y-4">
          {tableRowKeys.map((key) => (
            <Skeleton key={key} className="h-12 w-full bg-muted/60" />
          ))}
        </div>
      )}

      {layout === "form" && (
        <div className="max-w-2xl rounded-xl border border-border/60 bg-card p-6 space-y-6">
          <Skeleton className="h-10 w-full rounded-lg bg-muted/60" />
          <Skeleton className="h-10 w-full rounded-lg bg-muted/60" />
          <Skeleton className="h-24 w-full rounded-lg bg-muted/60" />
          <Skeleton className="h-12 w-32 rounded-lg bg-muted/80" />
        </div>
      )}

      {layout === "detail" && (
        <div className="space-y-6">
          <Skeleton className="h-48 w-full rounded-2xl bg-muted/70" />
          <div className="grid grid-cols-3 gap-4">
            <Skeleton className="h-28 rounded-xl bg-muted/60" />
            <Skeleton className="h-28 rounded-xl bg-muted/60" />
            <Skeleton className="h-28 rounded-xl bg-muted/60" />
          </div>
        </div>
      )}
    </div>
  );
}
