import { ArrowRight, Clock, IndianRupee, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { FALLBACK_CUISINE_IMAGES } from "../../constants/customer-restaurant.constants";
import type { CustomerRestaurantItem } from "../../types/customer-restaurant.types";

export interface RestaurantCardProps {
  restaurant: CustomerRestaurantItem;
}

function resolveRestaurantImage(cuisine?: string | null): string {
  if (cuisine) {
    const normalized = cuisine.toLowerCase();
    for (const [key, url] of Object.entries(FALLBACK_CUISINE_IMAGES)) {
      if (key !== "default" && normalized.includes(key)) {
        return url;
      }
    }
  }
  return FALLBACK_CUISINE_IMAGES.default;
}

export function RestaurantCard({ restaurant }: RestaurantCardProps) {
  const imageUrl = resolveRestaurantImage(restaurant.cuisineType);
  const locationLabel = [restaurant.city, restaurant.state].filter(Boolean).join(", ");

  return (
    <div
      data-testid={`restaurant-card-${restaurant.id}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-neutral-200/80 bg-white shadow-2xs transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:border-neutral-300"
    >
      {/* Cover Image Container */}
      <div className="relative aspect-4/3 w-full overflow-hidden bg-neutral-100">
        <img
          src={imageUrl}
          alt={restaurant.restaurantName}
          loading="lazy"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = FALLBACK_CUISINE_IMAGES.default;
          }}
          className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
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
                <span className="max-w-[80px] truncate">{restaurant.city || locationLabel}</span>
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
            <span className="size-1 rounded-full bg-neutral-300" />
            <span className="inline-flex items-center gap-1 text-[11px] text-emerald-600 font-medium">
              <Clock className="size-3" />
              <span>Open</span>
            </span>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-4 border-t border-neutral-100 mt-3 flex items-center justify-between">
          <Link
            to={`/restaurant/${restaurant.id}`}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#ff6b00] hover:text-[#e05e00] transition-colors"
          >
            <span>View Details</span>
            <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
          </Link>
          <span className="text-[10px] text-neutral-400 font-medium">Live Queue</span>
        </div>
      </div>
    </div>
  );
}
