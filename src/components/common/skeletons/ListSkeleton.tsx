import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils/cn";

export interface ListSkeletonProps {
  count?: number;
  hasAvatar?: boolean;
  avatarShape?: "circle" | "square";
  lines?: number;
  className?: string;
}

export function ListSkeleton({
  count = 5,
  hasAvatar = true,
  avatarShape = "circle",
  lines = 2,
  className,
}: ListSkeletonProps) {
  const itemKeys = Array.from({ length: count }, (_, i) => `list-item-${i}`);
  const lineKeys = Array.from({ length: lines - 1 }, (_, i) => `subline-${i}`);

  return (
    <div
      data-slot="list-skeleton"
      className={cn(
        "divide-y divide-border/60 rounded-xl border border-border/60 bg-card",
        className,
      )}
    >
      {itemKeys.map((key) => (
        <div key={key} className="flex items-center gap-4 p-4">
          {hasAvatar && (
            <Skeleton
              className={cn(
                "size-10 shrink-0 bg-muted/70",
                avatarShape === "circle" ? "rounded-full" : "rounded-lg",
              )}
            />
          )}
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-1/3 bg-muted/80" />
            {lineKeys.map((subKey) => (
              <Skeleton key={`${key}-${subKey}`} className="h-3 w-2/3 bg-muted/50" />
            ))}
          </div>
          <Skeleton className="h-8 w-16 rounded-md bg-muted/60" />
        </div>
      ))}
    </div>
  );
}
