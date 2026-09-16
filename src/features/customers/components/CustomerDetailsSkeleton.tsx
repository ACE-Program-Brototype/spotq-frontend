export function CustomerDetailsSkeleton() {
  return (
    <div className="space-y-6 animate-pulse" data-testid="customer-details-skeleton">
      <div className="h-8 w-44 rounded bg-slate-200" />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="h-7 w-48 rounded bg-slate-200" />
            <div className="h-6 w-20 rounded-full bg-slate-200" />
          </div>
          <div className="h-4 w-72 rounded bg-slate-100" />
        </div>
        <div className="h-9 w-36 rounded-lg bg-slate-200" />
      </div>

      <div className="rounded-xl border border-slate-200/80 bg-white p-6 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div className="flex items-center gap-4">
            <div className="size-16 rounded-full bg-slate-200 shrink-0" />
            <div className="space-y-2">
              <div className="h-5 w-40 rounded bg-slate-200" />
              <div className="h-4 w-52 rounded bg-slate-100" />
            </div>
          </div>
          <div className="h-9 w-32 rounded-lg bg-slate-200" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          <div className="space-y-2">
            <div className="h-3 w-20 rounded bg-slate-200" />
            <div className="h-4 w-36 rounded bg-slate-100" />
          </div>
          <div className="space-y-2">
            <div className="h-3 w-20 rounded bg-slate-200" />
            <div className="h-4 w-44 rounded bg-slate-100" />
          </div>
          <div className="space-y-2">
            <div className="h-3 w-20 rounded bg-slate-200" />
            <div className="h-4 w-28 rounded bg-slate-100" />
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200/80 bg-white p-6 shadow-xs space-y-4">
        <div className="h-5 w-36 rounded bg-slate-200" />
        <div className="h-4 w-64 rounded bg-slate-100" />
        <div className="space-y-3 pt-2">
          <div className="h-12 w-full rounded bg-slate-100" />
          <div className="h-12 w-full rounded bg-slate-100" />
        </div>
      </div>
    </div>
  );
}

export default CustomerDetailsSkeleton;
