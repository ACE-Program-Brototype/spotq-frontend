import { CardSkeleton } from "@/components/common/skeletons";

export function RestaurantCardSkeleton() {
  return (
    <div data-slot="restaurant-card-skeleton">
      <CardSkeleton
        imageAspect="aspect-4/3"
        lines={3}
        hasFooter={false}
        className="rounded-2xl border-neutral-200/80 bg-white"
      />
    </div>
  );
}
