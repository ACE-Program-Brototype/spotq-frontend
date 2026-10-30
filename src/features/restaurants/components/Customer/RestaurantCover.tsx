import { Clock3, MapPin } from "lucide-react";
import { usePresignedUrl } from "@/hooks/usePresignedUrl";
import { formatCurrency } from "@/lib/utils";
import type { CustomerRestaurantDetails } from "../../types/customer-restaurant.types";

const FALLBACK_COVER =
  "https://images.unsplash.com/photo-1563379091339-03246963d96c?auto=format&fit=crop&w=1800&q=85";

interface RestaurantCoverProps {
  restaurant: CustomerRestaurantDetails;
}

export function RestaurantCover({ restaurant }: RestaurantCoverProps) {
  const { data: imageUrl } = usePresignedUrl(restaurant.coverImage);
  const isOpen = restaurant.isOpened ?? restaurant.settings?.isOpened;

  return (
    <div className="relative h-[300px] overflow-hidden rounded-[28px] bg-stone-900 sm:h-[360px] lg:h-[420px]">
      <img
        src={imageUrl || FALLBACK_COVER}
        alt={`${restaurant.restaurantName} cuisine`}
        className="absolute inset-0 size-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/10" />
      <div className="absolute inset-x-0 bottom-0 p-6 text-white sm:p-9">
        <div className="mb-3 flex flex-wrap gap-2 text-xs font-semibold">
          <span className="rounded-full bg-black/45 px-3 py-1.5 backdrop-blur">
            <Clock3 className="mr-1.5 inline size-3.5" />
            {isOpen === true ? "Open today" : isOpen === false ? "Closed" : "Hours vary"}
          </span>
          <span className="rounded-full bg-black/45 px-3 py-1.5 backdrop-blur">
            <MapPin className="mr-1.5 inline size-3.5" />
            {[restaurant.address?.addressLine1, restaurant.address?.city, restaurant.address?.state]
              .filter(Boolean)
              .join(", ")}
          </span>
        </div>
        <h1 className="text-4xl font-black tracking-tight sm:text-5xl">
          {restaurant.restaurantName}
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-white/85 sm:text-base">
          {restaurant.description}
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {restaurant.type && (
            <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-bold">
              {restaurant.type === "QUEUE_PRO"
                ? "Queue Pro"
                : restaurant.type === "SELF_PRO"
                  ? "Self Pro"
                  : restaurant.type}
            </span>
          )}
          {(restaurant.cuisineType || "Local favorites").split(",").map((cuisine) => (
            <span key={cuisine} className="rounded-full bg-[#ff6b00] px-3 py-1 text-xs font-bold">
              {cuisine.trim()}
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
