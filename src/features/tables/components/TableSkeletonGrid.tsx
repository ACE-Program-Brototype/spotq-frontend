export function TableSkeletonGrid({ count = 10 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 min-[420px]:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3.5 sm:gap-4 animate-pulse">
      {Array.from({ length: count }).map((_, index) => (
        <div
          // biome-ignore lint/suspicious/noArrayIndexKey: Skeleton placeholders
          key={`skeleton-card-${index}`}
          className="flex flex-col justify-between h-28 rounded-2xl p-4 bg-white border border-[#eddcd4] shadow-2xs"
        >
          <div className="flex items-center justify-between">
            <div className="h-6 w-12 bg-neutral-200 rounded-md" />
            <div className="h-5 w-20 bg-neutral-100 rounded-full" />
          </div>
          <div className="flex items-center justify-between pt-2">
            <div className="h-4 w-16 bg-neutral-100 rounded" />
            <div className="h-3 w-10 bg-neutral-100 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}
