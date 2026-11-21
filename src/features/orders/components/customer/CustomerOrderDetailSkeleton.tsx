export function CustomerOrderDetailSkeleton() {
  return (
    <div
      data-testid="customer-order-detail-skeleton"
      className="space-y-6 max-w-6xl mx-auto animate-pulse pb-12"
    >
      {/* Header Skeleton */}
      <div className="space-y-3">
        <div className="h-4 w-28 bg-neutral-200 rounded-md" />
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="h-8 w-48 bg-neutral-200 rounded-lg" />
            <div className="h-4 w-64 bg-neutral-200 rounded-md" />
          </div>
          <div className="flex items-center gap-2">
            <div className="h-9 w-24 bg-neutral-200 rounded-xl" />
            <div className="h-9 w-28 bg-neutral-200 rounded-xl" />
          </div>
        </div>
      </div>

      {/* Tracker Skeleton */}
      <div className="rounded-2xl border border-neutral-200 bg-white p-6 space-y-4">
        <div className="h-4 w-40 bg-neutral-200 rounded-md" />
        <div className="h-14 w-full bg-neutral-100 rounded-xl" />
      </div>

      {/* Main Grid Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl border border-neutral-200 bg-white p-6 space-y-4">
            <div className="h-5 w-32 bg-neutral-200 rounded-md" />
            <div className="space-y-3">
              <div className="h-12 w-full bg-neutral-100 rounded-xl" />
              <div className="h-12 w-full bg-neutral-100 rounded-xl" />
            </div>
          </div>
          <div className="rounded-2xl border border-neutral-200 bg-white p-6 space-y-3">
            <div className="h-4 w-36 bg-neutral-200 rounded-md" />
            <div className="h-16 w-full bg-neutral-100 rounded-xl" />
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-neutral-200 bg-white p-5 space-y-3">
            <div className="h-4 w-32 bg-neutral-200 rounded-md" />
            <div className="h-20 w-full bg-neutral-100 rounded-xl" />
          </div>
          <div className="rounded-2xl border border-neutral-200 bg-white p-5 space-y-3">
            <div className="h-4 w-36 bg-neutral-200 rounded-md" />
            <div className="h-28 w-full bg-neutral-100 rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}
