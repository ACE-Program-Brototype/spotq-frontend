import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils/cn";

export interface DetailSkeletonProps {
  hasCoverImage?: boolean;
  hasAvatar?: boolean;
  gridSections?: number;
  className?: string;
}

export function DetailSkeleton({
  hasCoverImage = true,
  hasAvatar = true,
  gridSections = 4,
  className,
}: DetailSkeletonProps) {
  const cardKeys = Array.from({ length: gridSections }, (_, i) => `detail-card-${i}`);

  return (
    <div data-slot="detail-skeleton" className={cn("space-y-6", className)}>
      {hasCoverImage && <Skeleton className="h-48 w-full rounded-2xl bg-muted/70 md:h-64" />}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          {hasAvatar && <Skeleton className="size-16 rounded-full bg-muted/80 sm:size-20" />}
          <div className="space-y-2">
            <Skeleton className="h-6 w-48 bg-muted/80" />
            <Skeleton className="h-4 w-32 bg-muted/60" />
          </div>
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-10 w-24 rounded-lg bg-muted/70" />
          <Skeleton className="h-10 w-24 rounded-lg bg-muted/70" />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cardKeys.map((key) => (
          <div key={key} className="rounded-xl border border-border/60 bg-card p-4 space-y-3">
            <Skeleton className="h-4 w-20 bg-muted/70" />
            <Skeleton className="h-8 w-32 bg-muted/80" />
            <Skeleton className="h-3 w-24 bg-muted/50" />
          </div>
        ))}
      </div>
    </div>
  );
}
