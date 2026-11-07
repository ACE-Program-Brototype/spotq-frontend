export function ReceiptSkeleton() {
  return (
    <div
      role="status"
      data-testid="receipt-skeleton"
      aria-busy="true"
      aria-label="Loading receipt"
      className="max-w-xl mx-auto rounded-2xl bg-white border border-neutral-200 overflow-hidden shadow-sm animate-pulse"
    >
      <div className="p-6 border-b border-neutral-100 space-y-3">
        <div className="h-4 w-32 bg-neutral-200 rounded" />
        <div className="h-7 w-48 bg-neutral-200 rounded" />
        <div className="h-3 w-40 bg-neutral-100 rounded" />
      </div>

      <div className="p-6 space-y-4">
        <div className="h-4 w-28 bg-neutral-200 rounded" />
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <div className="h-4 w-40 bg-neutral-200 rounded" />
            <div className="h-4 w-16 bg-neutral-200 rounded" />
          </div>
          <div className="h-3 w-32 bg-neutral-100 rounded ml-4" />
          <div className="h-3 w-48 bg-neutral-100 rounded ml-4" />
        </div>
      </div>

      <div className="p-6 bg-neutral-50 border-t border-neutral-100 space-y-3">
        <div className="flex justify-between">
          <div className="h-3 w-24 bg-neutral-200 rounded" />
          <div className="h-3 w-16 bg-neutral-200 rounded" />
        </div>
        <div className="flex justify-between">
          <div className="h-3 w-24 bg-neutral-200 rounded" />
          <div className="h-3 w-16 bg-neutral-200 rounded" />
        </div>
        <div className="pt-3 border-t border-neutral-200 flex justify-between">
          <div className="h-5 w-28 bg-neutral-200 rounded" />
          <div className="h-5 w-24 bg-neutral-200 rounded" />
        </div>
      </div>
    </div>
  );
}
