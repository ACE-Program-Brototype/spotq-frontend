/**
 * Menu Item Detail Skeleton Loader
 * Accessible loading state placeholder for the single menu item detail screen.
 */

import { Skeleton } from "@/components/ui/skeleton";

export function MenuItemDetailSkeleton() {
  return (
    <div
      role="status"
      className="space-y-6 animate-in fade-in-50 duration-300"
      aria-busy="true"
      aria-label="Loading menu item details"
    >
      {/* Header Breadcrumb & Actions Skeleton */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-5 w-36 rounded-md bg-[#faf7f5]" />
          <Skeleton className="h-9 w-36 rounded-2xl bg-[#faf7f5]" />
        </div>
        <div className="flex items-center justify-between pb-2 border-b border-[#f3e6de]">
          <div className="space-y-2">
            <Skeleton className="h-8 w-64 rounded-xl bg-[#faf7f5]" />
            <Skeleton className="h-4 w-40 rounded-md bg-[#faf7f5]" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-10 w-24 rounded-xl bg-[#faf7f5]" />
            <Skeleton className="h-10 w-24 rounded-xl bg-[#faf7f5]" />
          </div>
        </div>
      </div>

      {/* Hero Card Skeleton */}
      <div className="rounded-3xl border border-[#eddcd4] bg-white p-6 sm:p-8 shadow-xs">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 items-start">
          <div className="md:col-span-4 lg:col-span-3">
            <Skeleton className="aspect-square w-full rounded-2xl bg-[#faf7f5]" />
          </div>
          <div className="md:col-span-8 lg:col-span-9 space-y-4">
            <div className="flex gap-2">
              <Skeleton className="h-6 w-24 rounded-xl bg-[#faf7f5]" />
              <Skeleton className="h-6 w-20 rounded-xl bg-[#faf7f5]" />
              <Skeleton className="h-6 w-20 rounded-xl bg-[#faf7f5]" />
            </div>
            <Skeleton className="h-7 w-3/4 rounded-xl bg-[#faf7f5]" />
            <Skeleton className="h-14 w-full rounded-xl bg-[#faf7f5]" />
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-4 border-t border-[#f3e6de]">
              <Skeleton className="h-16 rounded-2xl bg-[#faf7f5]" />
              <Skeleton className="h-16 rounded-2xl bg-[#faf7f5]" />
              <Skeleton className="h-16 rounded-2xl bg-[#faf7f5]" />
            </div>
          </div>
        </div>
      </div>

      {/* Variants Matrix Card Skeleton */}
      <div className="rounded-3xl border border-[#eddcd4] bg-white p-6 sm:p-8 shadow-xs space-y-4">
        <Skeleton className="h-6 w-48 rounded-xl bg-[#faf7f5]" />
        <Skeleton className="h-32 w-full rounded-2xl bg-[#faf7f5]" />
      </div>

      {/* Addons Card Skeleton */}
      <div className="rounded-3xl border border-[#eddcd4] bg-white p-6 sm:p-8 shadow-xs space-y-4">
        <Skeleton className="h-6 w-48 rounded-xl bg-[#faf7f5]" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Skeleton className="h-24 rounded-2xl bg-[#faf7f5]" />
          <Skeleton className="h-24 rounded-2xl bg-[#faf7f5]" />
          <Skeleton className="h-24 rounded-2xl bg-[#faf7f5]" />
        </div>
      </div>
    </div>
  );
}
