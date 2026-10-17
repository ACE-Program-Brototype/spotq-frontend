import { Clock, IndianRupee, MapPin, Store } from "lucide-react";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { usePresignedUrl } from "../../hooks/usePresignedUrl";
import type { CustomerRestaurantItem } from "../../types/customer-restaurant.types";

export interface RestaurantCardProps {
  restaurant: CustomerRestaurantItem;
}

export function RestaurantCard({ restaurant }: RestaurantCardProps) {
  const [imageError, setImageError] = useState(false);

  const { data: imageUrl, isLoading } = usePresignedUrl(restaurant.coverImage);
  const locationLabel = `${restaurant.city || ""}${restaurant.city && restaurant.state ? ", " : ""}${restaurant.state || ""}`;

  const isOpen = restaurant.isOpen ?? restaurant.isOpened ?? null;

  return (
    <div
      data-testid={`restaurant-card-${restaurant.id}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-neutral-200/80 bg-white shadow-2xs transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:border-neutral-300"
    >
      {/* Cover Image Container */}
      <div className="relative aspect-4/3 w-full overflow-hidden bg-neutral-100">
        {isLoading ? (
          <Skeleton className="size-full rounded-none" />
        ) : imageUrl && !imageError ? (
          <img
            src={imageUrl}
            alt={restaurant.restaurantName}
            loading="lazy"
            onError={() => setImageError(true)}
            className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex size-full flex-col items-center justify-center bg-gradient-to-br from-neutral-800 to-neutral-900 p-4 text-white">
            <div className="flex size-12 items-center justify-center rounded-2xl bg-[#ff6b00]/15 text-[#ff6b00] border border-[#ff6b00]/25 mb-2 shadow-2xs">
              <Store className="size-6" />
            </div>
            <span className="text-xs font-bold text-neutral-200 line-clamp-1 text-center">
              {restaurant.restaurantName}
            </span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
        {restaurant.cuisineType && (
          <span className="absolute bottom-2.5 left-2.5 rounded-full bg-white/95 backdrop-blur-xs px-2.5 py-1 text-[10px] font-bold text-neutral-800 shadow-xs border border-white/50">
            {restaurant.cuisineType.split(",")[0].trim()}
          </span>
        )}
      </div>

      {/* Card Content */}
      <div className="flex flex-1 flex-col justify-between p-4">
        <div className="space-y-2">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-bold text-neutral-900 text-sm line-clamp-1 group-hover:text-[#ff6b00] transition-colors">
              {restaurant.restaurantName}
            </h3>
            {locationLabel && (
              <span className="inline-flex items-center gap-1 text-[10px] font-medium text-neutral-400 shrink-0">
                <MapPin className="size-3 text-neutral-400" />
                <span className="max-w-[80px] truncate">{locationLabel}</span>
              </span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs text-neutral-500">
            {restaurant.averageCost ? (
              <span className="inline-flex items-center gap-0.5 font-semibold text-neutral-700">
                <IndianRupee className="size-3 text-neutral-500" />
                <span>{restaurant.averageCost} for two</span>
              </span>
            ) : (
              <span className="text-neutral-400 italic">Casual Dining</span>
            )}
          </div>
        </div>

        {/* Card Footer */}
        <div className="pt-3 border-t border-neutral-100 mt-3 flex items-center justify-between">
          <span
            className={`inline-flex items-center gap-1 text-[11px] font-medium ${
              isOpen === true ? "text-emerald-600" : "text-neutral-400"
            }`}
          >
            <Clock className="size-3" />
            <span>
              {isOpen === true ? "Open Now" : isOpen === false ? "Closed" : "Status unavailable"}
            </span>
          </span>
          <span className="text-[10px] text-neutral-400 font-medium">
            {restaurant.acceptsQueue === false ? "Queue Paused" : "Live Queue"}
          </span>
        </div>
      </div>
    </div>
  );
}
