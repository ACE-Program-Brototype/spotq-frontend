import { Clock, Heart, MapPin, Share2 } from "lucide-react";
import { usePresignedUrl } from "@/features/restaurants/hooks/usePresignedUrl";
import type { CustomerRestaurantDetails } from "@/features/restaurants/types/customer-restaurant-details.types";

export interface RestaurantHeroHeaderProps {
  restaurant: CustomerRestaurantDetails;
  onShare?: () => void;
}

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export function RestaurantHeroHeader({ restaurant, onShare }: RestaurantHeroHeaderProps) {
  const { data: coverImageUrl } = usePresignedUrl(restaurant.coverImage);

  const todayIndex = new Date().getDay();
  const todayHours = restaurant.operatingHours?.find((h) => h.dayOfWeek === todayIndex);
  const dayName = DAYS[todayIndex];
  const hoursLabel =
    todayHours?.isOpen && todayHours.openTime && todayHours.closeTime
      ? `${dayName}: ${todayHours.openTime} - ${todayHours.closeTime}`
      : "Monday: 09:00 AM - 10:00 PM";

  const locationLabel = restaurant.address
    ? `${restaurant.address.addressLine1 ? `${restaurant.address.addressLine1}, ` : ""}${restaurant.address.city || ""}`
    : "Connaught Place, New Delhi";

  const cuisineTag = restaurant.cuisineType?.split(",")[0]?.trim() || "Family Restaurant";

  return (
    <div className="relative w-full h-72 sm:h-80 md:h-[380px] bg-neutral-900 overflow-hidden text-white">
      {/* 1. Cover Image */}
      {coverImageUrl ? (
        <img
          src={coverImageUrl}
          alt={restaurant.restaurantName}
          className="size-full object-cover object-center"
        />
      ) : (
        <div className="size-full bg-gradient-to-r from-neutral-950 via-stone-900 to-amber-950" />
      )}

      {/* 2. Dark Atmospheric Scrim Gradients matching Figma */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/20" />

      {/* 3. Floating Quick Action Buttons */}
      <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
        <button
          type="button"
          onClick={onShare}
          className="size-9 rounded-full bg-black/40 text-white backdrop-blur-md hover:bg-black/60 border border-white/15 flex items-center justify-center transition-colors"
          aria-label="Share restaurant"
        >
          <Share2 className="size-4" />
        </button>
        <button
          type="button"
          className="size-9 rounded-full bg-black/40 text-white backdrop-blur-md hover:bg-black/60 border border-white/15 flex items-center justify-center transition-colors"
          aria-label="Save to favorites"
        >
          <Heart className="size-4" />
        </button>
      </div>

      {/* 4. Overlay Content at Bottom-Left */}
      <div className="absolute inset-x-0 bottom-0 z-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-7">
          {/* Glass Badges Row */}
          <div className="flex flex-wrap items-center gap-2.5 mb-3">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-black/45 backdrop-blur-md px-3.5 py-1 text-xs font-medium text-white/95 border border-white/20 shadow-xs">
              <Clock className="size-3 text-white/80" />
              <span>{hoursLabel}</span>
            </div>
            {locationLabel && (
              <div className="inline-flex items-center gap-1.5 rounded-full bg-black/45 backdrop-blur-md px-3.5 py-1 text-xs font-medium text-white/95 border border-white/20 shadow-xs">
                <MapPin className="size-3 text-white/80" />
                <span>{locationLabel}</span>
              </div>
            )}
          </div>

          {/* Title */}
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-white tracking-tight drop-shadow-sm mb-2">
            {restaurant.restaurantName}
          </h1>

          {/* Subtitle / Description */}
          {restaurant.description && (
            <p className="text-xs sm:text-sm text-neutral-200/90 max-w-2xl line-clamp-2 mb-3 font-normal leading-relaxed">
              {restaurant.description}
            </p>
          )}

          {/* Cuisine Pill */}
          <span className="inline-flex items-center rounded-full bg-[#ff6b00] px-3.5 py-1 text-xs font-bold text-white shadow-xs">
            {cuisineTag}
          </span>
        </div>
      </div>
    </div>
  );
}
