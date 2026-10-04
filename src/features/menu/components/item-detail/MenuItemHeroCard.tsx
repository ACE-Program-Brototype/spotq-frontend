import { Clock, Layers, Sparkles, Utensils } from "lucide-react";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { DIETARY_OPTIONS } from "@/features/menu/constants/menu.constants";
import type { MenuItemDetail } from "@/features/menu/types/menu-item.types";
import { usePresignedUrl } from "@/hooks/usePresignedUrl";
import { cn } from "@/lib/utils/cn";

export interface MenuItemHeroCardProps {
  item: MenuItemDetail;
}

export function MenuItemHeroCard({ item }: MenuItemHeroCardProps) {
  const [imageError, setImageError] = useState(false);

  const rawImageKey =
    item.imageUrl || item.image || item.images?.[0]?.objectKey || item.images?.[0]?.url;

  const { data: presignedUrl, isLoading: isImageLoading } = usePresignedUrl(rawImageKey);

  const displayImageUrl = presignedUrl || rawImageKey;

  // Resolve Dietary configuration
  const dietaryValue = item.dietaryType || (item.isVegetarian ? "VEG" : "NON_VEG");
  const dietaryConfig =
    DIETARY_OPTIONS.find((opt) => opt.value === dietaryValue) ??
    DIETARY_OPTIONS[item.isVegetarian ? 0 : 1];

  return (
    <div className="rounded-3xl border border-[#eddcd4] bg-white p-6 sm:p-8 shadow-xs overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 items-start">
        {/* Media Thumbnail / Gallery */}
        <div className="md:col-span-4 lg:col-span-3">
          <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-[#faf7f5] border border-[#eddcd4] flex items-center justify-center shadow-inner group">
            {isImageLoading ? (
              <Skeleton className="h-full w-full" />
            ) : displayImageUrl && !imageError ? (
              <img
                src={displayImageUrl}
                alt={item.name}
                className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="flex flex-col items-center justify-center gap-2 text-[#e8631b] p-4 text-center">
                <Utensils className="size-12 opacity-40" />
                <span className="text-xs font-semibold text-neutral-400">No image available</span>
              </div>
            )}

            {/* Featured Overlay Badge */}
            {item.isFeatured && (
              <div className="absolute top-3 left-3 inline-flex items-center gap-1 rounded-full bg-amber-500/95 backdrop-blur-xs px-2.5 py-1 text-xs font-bold text-white shadow-md">
                <Sparkles className="size-3" />
                <span>Featured Dish</span>
              </div>
            )}
          </div>
        </div>

        {/* Core Metadata & Description */}
        <div className="md:col-span-8 lg:col-span-9 space-y-4">
          {/* Category & Badges Row */}
          <div className="flex items-center gap-2.5 flex-wrap">
            {item.categoryName && (
              <span className="inline-flex items-center gap-1.5 rounded-xl bg-[#faf7f5] px-3 py-1 text-xs font-bold text-neutral-700 border border-[#eddcd4]">
                <Layers className="size-3.5 text-[#e8631b]" />
                {item.categoryName}
              </span>
            )}

            <span
              className={cn(
                "inline-flex items-center gap-1.5 rounded-xl px-3 py-1 text-xs font-bold border",
                dietaryConfig.badgeClass,
              )}
            >
              <span className={cn("size-2 rounded-full", dietaryConfig.dotColor)} />
              {dietaryConfig.label}
            </span>

            <span
              className={cn(
                "inline-flex items-center gap-1.5 rounded-xl px-3 py-1 text-xs font-bold border",
                item.isAvailable
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                  : "bg-neutral-100 text-neutral-600 border-neutral-200",
              )}
            >
              <span
                className={cn(
                  "size-2 rounded-full",
                  item.isAvailable ? "bg-emerald-500" : "bg-neutral-400",
                )}
              />
              {item.isAvailable ? "In Stock" : "Out of Stock"}
            </span>
          </div>

          {/* Dish Description */}
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 leading-snug">
              {item.name}
            </h2>
            <p className="text-sm text-neutral-600 mt-2 leading-relaxed whitespace-pre-line">
              {item.description || "No description provided for this menu item."}
            </p>
          </div>

          {/* Key Metrics Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-4 border-t border-[#f3e6de]">
            {/* Base Price */}
            <div className="rounded-2xl bg-[#faf7f5] border border-[#eddcd4] p-3.5">
              <span className="text-xs font-semibold text-neutral-500">Base Price</span>
              <p className="text-lg sm:text-xl font-extrabold text-neutral-900 mt-0.5">
                ₹{typeof item.price === "number" ? item.price.toFixed(2) : item.price}
              </p>
            </div>

            {/* Prep Time */}
            <div className="rounded-2xl bg-[#faf7f5] border border-[#eddcd4] p-3.5">
              <span className="text-xs font-semibold text-neutral-500">Preparation Time</span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <Clock className="size-4 text-[#e8631b]" />
                <p className="text-base sm:text-lg font-bold text-neutral-900">
                  {item.preparationTime ? `${item.preparationTime} mins` : "Not set"}
                </p>
              </div>
            </div>

            {/* Total Variants Count */}
            <div className="rounded-2xl bg-[#faf7f5] border border-[#eddcd4] p-3.5 col-span-2 sm:col-span-1">
              <span className="text-xs font-semibold text-neutral-500">Portion Variants</span>
              <p className="text-base sm:text-lg font-bold text-neutral-900 mt-0.5">
                {item.variants?.length || 0} configured
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
