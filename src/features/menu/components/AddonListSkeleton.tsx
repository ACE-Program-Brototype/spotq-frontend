import { Skeleton } from "@/components/ui/skeleton";

const SKELETON_ITEMS = [
  "addon-skel-1",
  "addon-skel-2",
  "addon-skel-3",
  "addon-skel-4",
  "addon-skel-5",
  "addon-skel-6",
];

export function AddonListSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {SKELETON_ITEMS.map((key) => (
        <div key={key} className="rounded-2xl border border-[#eddcd4] bg-white p-5 space-y-4">
          <div className="flex items-center justify-between">
            <Skeleton className="h-6 w-24 rounded-lg" />
            <Skeleton className="h-6 w-20 rounded-full" />
          </div>

          <div className="flex items-center gap-3.5">
            <Skeleton className="size-12 rounded-xl shrink-0" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-5 w-3/4 rounded-md" />
              <Skeleton className="h-3.5 w-full rounded-md" />
            </div>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-[#f3e6de]">
            <Skeleton className="h-4 w-20 rounded-md" />
            <Skeleton className="h-5 w-16 rounded-md" />
          </div>
        </div>
      ))}
    </div>
  );
}
