import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils/cn";

export interface CardSkeletonProps {
  hasImage?: boolean;
  imageAspect?: string;
  lines?: number;
  hasFooter?: boolean;
  className?: string;
}

export function CardSkeleton({
  hasImage = true,
  imageAspect = "aspect-4/3",
  lines = 3,
  hasFooter = true,
  className,
}: CardSkeletonProps) {
  const lineKeys = Array.from({ length: lines }, (_, i) => `card-line-${i}`);

  return (
    <div
      data-slot="card-skeleton"
      className={cn(
        "flex flex-col overflow-hidden rounded-2xl border border-border/60 bg-card shadow-2xs",
        className,
      )}
    >
      {hasImage && <Skeleton className={cn("w-full bg-muted/70", imageAspect)} />}
      <div className="flex flex-1 flex-col justify-between p-4 space-y-3">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-1/2 bg-muted/70" />
            <Skeleton className="h-3 w-1/4 bg-muted/70" />
          </div>
          {lineKeys.map((key, i) => (
            <Skeleton
              key={key}
              className={cn("h-3 bg-muted/60", i === lines - 1 ? "w-1/3" : "w-3/4")}
            />
          ))}
        </div>
        {hasFooter && (
          <div className="pt-2 flex items-center justify-between">
            <Skeleton className="h-4 w-1/4 bg-muted/70" />
            <Skeleton className="h-8 w-20 rounded-lg bg-muted/70" />
          </div>
        )}
      </div>
    </div>
  );
}
