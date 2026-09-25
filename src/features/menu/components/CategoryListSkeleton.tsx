/**
 * Category List Skeleton Loader
 * Renders placeholder loading cards while categories are being fetched.
 */

import { Skeleton } from "@/components/ui/skeleton";

const SKELETON_ITEMS = [
  "cat-skel-1",
  "cat-skel-2",
  "cat-skel-3",
  "cat-skel-4",
  "cat-skel-5",
  "cat-skel-6",
];

export function CategoryListSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {SKELETON_ITEMS.map((id) => (
        <div
          key={id}
          className="rounded-2xl border border-[#eddcd4] bg-white p-5 shadow-xs space-y-4"
        >
          <div className="flex items-center justify-between">
            <Skeleton className="h-5 w-28 rounded-lg bg-neutral-200" />
            <Skeleton className="h-5 w-16 rounded-full bg-neutral-200" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-5 w-3/4 rounded-md bg-neutral-200" />
            <Skeleton className="h-4 w-full rounded-md bg-neutral-100" />
            <Skeleton className="h-4 w-2/3 rounded-md bg-neutral-100" />
          </div>
          <div className="flex items-center justify-between pt-3 border-t border-neutral-100">
            <Skeleton className="h-4 w-20 rounded-md bg-neutral-100" />
            <Skeleton className="h-8 w-16 rounded-xl bg-neutral-200" />
          </div>
        </div>
      ))}
    </div>
  );
}
