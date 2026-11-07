import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function StaffDetailSkeleton() {
  return (
    <div className="space-y-6 max-w-5xl mx-auto w-full pb-10" data-testid="staff-detail-skeleton">
      {/* Header Skeleton */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-48 bg-muted/60" />
          <Skeleton className="h-4 w-36 bg-muted/60" />
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-2">
            <Skeleton className="h-8 w-60 bg-muted/80" />
            <Skeleton className="h-4 w-80 bg-muted/50" />
          </div>
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-32 rounded-xl bg-muted/60" />
            <Skeleton className="h-10 w-28 rounded-xl bg-muted/60" />
          </div>
        </div>
      </div>

      {/* Main Content Skeleton (Overview Card + Info Card) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Overview Skeleton */}
        <div className="lg:col-span-1">
          <Card className="rounded-2xl border-border/60 bg-card p-6 shadow-2xs">
            <CardContent className="flex flex-col items-center pt-4 space-y-4">
              <Skeleton className="size-28 rounded-full bg-muted/70" />
              <Skeleton className="h-6 w-40 bg-muted/60" />
              <Skeleton className="h-4 w-48 bg-muted/50" />
              <div className="flex gap-2">
                <Skeleton className="h-6 w-20 rounded-md bg-muted/50" />
                <Skeleton className="h-6 w-20 rounded-md bg-muted/50" />
              </div>
              <Skeleton className="h-4 w-36 bg-muted/50" />
            </CardContent>
          </Card>
        </div>

        {/* Details Skeleton */}
        <div className="lg:col-span-2">
          <Card className="rounded-2xl border-border/60 bg-card shadow-2xs">
            <CardHeader className="border-b border-border/60 pb-3">
              <Skeleton className="h-5 w-36 bg-muted/60" />
            </CardHeader>
            <CardContent className="space-y-5 pt-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {Array.from({ length: 7 }).map((_, i) => (
                  // biome-ignore lint/suspicious/noArrayIndexKey: Static array for skeleton placeholders
                  <div key={i} className="space-y-1.5">
                    <Skeleton className="h-3.5 w-24 bg-muted/50" />
                    <Skeleton className="h-10 w-full rounded-xl bg-muted/40" />
                  </div>
                ))}
              </div>
              <div className="pt-4 flex justify-between">
                <Skeleton className="h-4 w-40 bg-muted/50" />
                <Skeleton className="h-4 w-40 bg-muted/50" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default StaffDetailSkeleton;
