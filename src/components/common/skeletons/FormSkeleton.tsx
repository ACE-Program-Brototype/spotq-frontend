import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils/cn";

export interface FormSkeletonProps {
  fieldCount?: number;
  columns?: 1 | 2;
  hasSubmitButton?: boolean;
  className?: string;
}

export function FormSkeleton({
  fieldCount = 4,
  columns = 1,
  hasSubmitButton = true,
  className,
}: FormSkeletonProps) {
  const fieldKeys = Array.from({ length: fieldCount }, (_, i) => `form-field-${i}`);

  return (
    <div data-slot="form-skeleton" className={cn("space-y-6", className)}>
      <div
        className={cn("grid gap-5", columns === 2 ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1")}
      >
        {fieldKeys.map((key) => (
          <div key={key} className="space-y-2">
            <Skeleton className="h-4 w-28 bg-muted/80" />
            <Skeleton className="h-11 w-full rounded-xl bg-muted/60" />
            <Skeleton className="h-3 w-40 bg-muted/40" />
          </div>
        ))}
      </div>

      {hasSubmitButton && (
        <div className="pt-2">
          <Skeleton className="h-12 w-full rounded-xl bg-muted/80" />
        </div>
      )}
    </div>
  );
}
