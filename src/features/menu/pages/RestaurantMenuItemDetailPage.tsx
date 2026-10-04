/**
 * Restaurant Menu Item Detail Page
 * Route: /restaurant/menu/items/:itemId
 * Provides comprehensive inspection and management for a single menu item.
 */

import { AlertCircle, ArrowLeft, RotateCcw } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MenuItemAddonsCard } from "@/features/menu/components/item-detail/MenuItemAddonsCard";
import { MenuItemDetailHeader } from "@/features/menu/components/item-detail/MenuItemDetailHeader";
import { MenuItemDetailSkeleton } from "@/features/menu/components/item-detail/MenuItemDetailSkeleton";
import { MenuItemHeroCard } from "@/features/menu/components/item-detail/MenuItemHeroCard";
import { MenuItemVariantsCard } from "@/features/menu/components/item-detail/MenuItemVariantsCard";
import { useMenuItemDetail } from "@/features/menu/hooks/use-menu-item-detail";

export function RestaurantMenuItemDetailPage() {
  const { itemId } = useParams<{ itemId: string }>();

  const {
    item,
    isLoading,
    isError,
    error,
    refetch,
    isTogglingItem,
    isDeleting,
    handleToggleItemAvailability,
    handleDeleteItem,
  } = useMenuItemDetail({ itemId });

  if (isLoading) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <MenuItemDetailSkeleton />
      </div>
    );
  }

  if (isError || !item) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-rose-200 bg-rose-50/50 p-8 sm:p-12 text-center shadow-xs">
          <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-rose-100 text-rose-600 mb-4">
            <AlertCircle className="size-7" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-neutral-900">Menu Item Not Found</h2>
          <p className="text-sm text-neutral-600 max-w-md mx-auto mt-2">
            {error instanceof Error
              ? error.message
              : "Unable to retrieve details for the specified menu item. It may have been removed or you may lack permissions."}
          </p>
          <div className="flex items-center justify-center gap-3 mt-6 flex-wrap">
            <Link
              to="/restaurant/menu/items"
              className="inline-flex items-center gap-2 rounded-xl bg-white border border-[#eddcd4] px-4 py-2.5 text-xs font-bold text-neutral-700 hover:bg-[#faf7f5] transition-colors shadow-2xs"
            >
              <ArrowLeft className="size-4" />
              <span>Back to Menu Items</span>
            </Link>
            <Button
              type="button"
              variant="default"
              size="sm"
              onClick={() => refetch()}
              className="rounded-xl bg-[#e8631b] hover:bg-[#cf5110] text-white font-semibold text-xs h-10 px-4 shadow-xs gap-1.5"
            >
              <RotateCcw className="size-4" />
              <span>Retry</span>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 space-y-8 animate-in fade-in-50 duration-200">
      {/* Header Bar */}
      <MenuItemDetailHeader
        item={item}
        isTogglingAvailability={isTogglingItem}
        isDeleting={isDeleting}
        onToggleAvailability={handleToggleItemAvailability}
        onDelete={handleDeleteItem}
      />

      {/* Main Dish Hero & Information Card */}
      <MenuItemHeroCard item={item} />

      {/* Portion Sizes & Variants Matrix */}
      <MenuItemVariantsCard variants={item.variants || []} basePrice={item.price} />

      {/* Complementary Add-ons */}
      <MenuItemAddonsCard addons={item.addons || []} />
    </div>
  );
}

export default RestaurantMenuItemDetailPage;
