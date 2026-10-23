import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { usePresignedUrl } from "@/features/restaurants/hooks/usePresignedUrl";
import type { CustomerRestaurantMenuItem } from "@/features/restaurants/types/customer-restaurant-details.types";

export interface MenuItemCardProps {
  item: CustomerRestaurantMenuItem;
  onSelect: (item: CustomerRestaurantMenuItem) => void;
}

export function MenuItemCard({ item, onSelect }: MenuItemCardProps) {
  const [imageError, setImageError] = useState(false);
  const firstImageKey = item.images?.[0]?.objectKey;

  const isDirect = Boolean(firstImageKey?.startsWith("http"));
  const { data: presignedUrl, isLoading: presignedLoading } = usePresignedUrl(
    !isDirect ? firstImageKey : null,
  );

  const imageUrl = isDirect ? firstImageKey : presignedUrl;
  const imageLoading = !isDirect && presignedLoading;

  const isSoldOut = !item.isAvailable;

  return (
    <div
      data-testid={`menu-item-${item.id}`}
      className={`group flex flex-col sm:flex-row items-stretch rounded-2xl border border-neutral-200/90 bg-white overflow-hidden shadow-2xs hover:shadow-md transition-all ${
        isSoldOut ? "opacity-60 bg-neutral-50/50" : ""
      }`}
    >
      {/* 1. Left Dish Image */}
      <div className="relative w-full sm:w-52 h-44 sm:h-auto shrink-0 bg-neutral-900 overflow-hidden">
        {imageLoading ? (
          <Skeleton className="size-full rounded-none" />
        ) : imageUrl && !imageError ? (
          <img
            src={imageUrl}
            alt={item.name}
            onError={() => setImageError(true)}
            className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex size-full flex-col items-center justify-center bg-gradient-to-br from-neutral-800 to-neutral-950 p-4 text-center">
            <span className="text-xs font-semibold text-neutral-400">{item.name}</span>
          </div>
        )}

        {isSoldOut && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-2xs">
            <span className="rounded-md bg-rose-600 px-2 py-1 text-[10px] font-bold text-white uppercase tracking-wider">
              Sold Out
            </span>
          </div>
        )}
      </div>

      {/* 2. Center Content: Title, Description, Dietary tag */}
      <div className="flex-1 p-5 flex flex-col justify-center">
        <h3 className="text-base sm:text-lg font-bold text-neutral-900 group-hover:text-[#ff6b00] transition-colors mb-1">
          {item.name}
        </h3>

        {item.description && (
          <p className="text-xs sm:text-sm text-neutral-500 line-clamp-2 leading-relaxed mb-2.5">
            {item.description}
          </p>
        )}

        {item.isVegetarian && (
          <div className="flex items-center gap-1.5 text-[10px] font-extrabold text-amber-600 tracking-wider">
            <span className="size-2 rounded-full bg-amber-500" />
            <span>VEGETARIAN</span>
          </div>
        )}
      </div>

      {/* 3. Right Section: Price & Add to Cart Button */}
      <div className="p-5 sm:pl-0 sm:pr-6 flex sm:flex-col justify-between sm:justify-center items-center sm:items-end gap-3 shrink-0">
        <div className="text-lg sm:text-xl font-bold text-[#ff6b00]">
          ₹{Number(item.price).toFixed(2)}
        </div>

        <button
          type="button"
          aria-label={`Add ${item.name} to cart`}
          disabled={isSoldOut}
          onClick={() => onSelect(item)}
          className="bg-[#ff6b00] hover:bg-[#e05e00] text-white font-bold px-6 py-2.5 rounded-xl text-xs sm:text-sm shadow-xs transition-all active:scale-95 disabled:pointer-events-none disabled:opacity-40"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}
