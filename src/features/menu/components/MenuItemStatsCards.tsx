import { CheckCircle2, Layers, PackageX, UtensilsCrossed } from "lucide-react";
import type { MenuItemStats } from "@/features/menu/types/menu-item.types";

export interface MenuItemStatsCardsProps {
  stats: MenuItemStats;
}

export function MenuItemStatsCards({ stats }: MenuItemStatsCardsProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
      {/* Total Categories */}
      <div className="rounded-xl sm:rounded-2xl border border-[#eddcd4] bg-white p-3 sm:p-5 shadow-2xs">
        <div className="flex items-center justify-between gap-1.5">
          <p className="text-[11px] sm:text-xs font-semibold text-neutral-500 truncate">Categories</p>
          <div className="size-6 sm:size-8 rounded-lg sm:rounded-xl bg-[#fef3ec] border border-[#fae2d3] flex items-center justify-center text-[#9a3412] shrink-0">
            <Layers className="size-3 sm:size-4" />
          </div>
        </div>
        <p className="mt-1.5 sm:mt-3 text-lg sm:text-2xl font-bold text-neutral-900 leading-tight">
          {stats.totalCategories}
        </p>
        <p className="mt-0.5 sm:mt-1 text-[10px] sm:text-xs text-neutral-400 truncate">
          Configured sections
        </p>
      </div>

      {/* Total Menu Items */}
      <div className="rounded-xl sm:rounded-2xl border border-[#eddcd4] bg-white p-3 sm:p-5 shadow-2xs">
        <div className="flex items-center justify-between gap-1.5">
          <p className="text-[11px] sm:text-xs font-semibold text-neutral-500 truncate">Total Items</p>
          <div className="size-6 sm:size-8 rounded-lg sm:rounded-xl bg-neutral-100 border border-neutral-200 flex items-center justify-center text-neutral-600 shrink-0">
            <UtensilsCrossed className="size-3 sm:size-4" />
          </div>
        </div>
        <p className="mt-1.5 sm:mt-3 text-lg sm:text-2xl font-bold text-neutral-900 leading-tight">
          {stats.totalMenuItems}
        </p>
        <p className="mt-0.5 sm:mt-1 text-[10px] sm:text-xs text-neutral-400 truncate">
          Registered dishes
        </p>
      </div>

      {/* Available Items */}
      <div className="rounded-xl sm:rounded-2xl border border-[#eddcd4] bg-white p-3 sm:p-5 shadow-2xs">
        <div className="flex items-center justify-between gap-1.5">
          <p className="text-[11px] sm:text-xs font-semibold text-neutral-500 truncate">In Stock</p>
          <div className="size-6 sm:size-8 rounded-lg sm:rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shrink-0">
            <CheckCircle2 className="size-3 sm:size-4" />
          </div>
        </div>
        <p className="mt-1.5 sm:mt-3 text-lg sm:text-2xl font-bold text-emerald-600 leading-tight">
          {stats.availableItems}
        </p>
        <p className="mt-0.5 sm:mt-1 text-[10px] sm:text-xs text-neutral-400 truncate">
          Ready for order
        </p>
      </div>

      {/* Out of Stock */}
      <div className="rounded-xl sm:rounded-2xl border border-[#eddcd4] bg-white p-3 sm:p-5 shadow-2xs">
        <div className="flex items-center justify-between gap-1.5">
          <p className="text-[11px] sm:text-xs font-semibold text-neutral-500 truncate">Out of Stock</p>
          <div className="size-6 sm:size-8 rounded-lg sm:rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 shrink-0">
            <PackageX className="size-3 sm:size-4" />
          </div>
        </div>
        <p className="mt-1.5 sm:mt-3 text-lg sm:text-2xl font-bold text-rose-600 leading-tight">
          {stats.outOfStockItems}
        </p>
        <p className="mt-0.5 sm:mt-1 text-[10px] sm:text-xs text-neutral-400 truncate">
          Temporarily 86'd
        </p>
      </div>
    </div>
  );
}

export default MenuItemStatsCards;
