import { Clock3, MapPin } from "lucide-react";
import { useMemo } from "react";
import {
  DEFAULT_CUISINE_FALLBACK,
  FALLBACK_RESTAURANT_COVER_IMAGE,
  RESTAURANT_PLAN_TYPES,
  RESTAURANT_STATUS_LABELS,
} from "@/features/restaurants/constants/customer-restaurant.constants";
import type { CustomerRestaurantDetails } from "@/features/restaurants/types/customer-restaurant.types";
import { usePresignedUrl } from "@/hooks/usePresignedUrl";
import { formatCurrency } from "@/lib/utils";

interface RestaurantCoverProps {
  restaurant: CustomerRestaurantDetails;
}

export function RestaurantCover({ restaurant }: RestaurantCoverProps) {
  const { data: imageUrl } = usePresignedUrl(restaurant.coverImage);
  const isOpen = restaurant.isOpened ?? restaurant.settings?.isOpened;
  const planType = restaurant.type ?? restaurant.subscriptionType;

  const cuisines = useMemo(() => {
    return (restaurant.cuisineType || DEFAULT_CUISINE_FALLBACK)
      .split(",")
      .map((c) => c.trim())
      .filter(Boolean);
  }, [restaurant.cuisineType]);

  return (
    <div className="relative h-[300px] overflow-hidden rounded-[28px] bg-stone-900 sm:h-[360px] lg:h-[420px]">
      <img
        src={imageUrl || FALLBACK_RESTAURANT_COVER_IMAGE}
        alt={`${restaurant.restaurantName} cuisine`}
        className="absolute inset-0 size-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/10" />
      <div className="absolute inset-x-0 bottom-0 p-6 text-white sm:p-9">
        <div className="mb-3 flex flex-wrap gap-2 text-xs font-semibold">
          <span className="rounded-full bg-black/45 px-3 py-1.5 backdrop-blur">
            <Clock3 className="mr-1.5 inline size-3.5" />
            {isOpen === true
              ? RESTAURANT_STATUS_LABELS.OPEN_TODAY
              : isOpen === false
                ? RESTAURANT_STATUS_LABELS.CLOSED
                : RESTAURANT_STATUS_LABELS.HOURS_VARY}
          </span>
          <span className="rounded-full bg-black/45 px-3 py-1.5 backdrop-blur">
            <MapPin className="mr-1.5 inline size-3.5" />
            {[restaurant.address?.addressLine1, restaurant.address?.city, restaurant.address?.state]
              .filter(Boolean)
              .join(", ")}
          </span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black tracking-tight break-words [overflow-wrap:anywhere] line-clamp-2" title={restaurant.restaurantName}>
          {restaurant.restaurantName}
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-white/85 sm:text-base break-words [overflow-wrap:anywhere] line-clamp-3">
          {restaurant.description}
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {planType && (
            <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-bold">
              {planType === RESTAURANT_PLAN_TYPES.QUEUE_PRO
                ? RESTAURANT_PLAN_TYPES.QUEUE_PRO_DISPLAY
                : planType === RESTAURANT_PLAN_TYPES.SELF_PRO
                  ? RESTAURANT_PLAN_TYPES.SELF_PRO_DISPLAY
                  : planType}
            </span>
          )}
          {cuisines.map((cuisine) => (
            <span key={cuisine} className="rounded-full bg-[#ff6b00] px-3 py-1 text-xs font-bold">
              {cuisine}
            </span>
          ))}
          {restaurant.averageCost != null && (
            <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold">
              {formatCurrency(restaurant.averageCost)} average cost
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
