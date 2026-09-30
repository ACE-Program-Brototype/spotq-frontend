import { CheckCircle2, Layers, PackageX, UtensilsCrossed } from "lucide-react";
import type { MenuItemStats } from "../types/menu-item.types";

export interface MenuItemStatsCardsProps {
  stats: MenuItemStats;
}

export function MenuItemStatsCards({ stats }: MenuItemStatsCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total Categories */}
      <div className="rounded-2xl border border-[#eddcd4] bg-white p-5 shadow-2xs">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold text-neutral-500">Categories</p>
          <div className="size-8 rounded-xl bg-[#fef3ec] border border-[#fae2d3] flex items-center justify-center text-[#9a3412]">
            <Layers className="size-4" />
          </div>
        </div>
        <p className="mt-3 text-2xl font-bold text-neutral-900">{stats.totalCategories}</p>
        <p className="mt-1 text-xs text-neutral-400">Configured menu sections</p>
      </div>

      {/* Total Menu Items */}
      <div className="rounded-2xl border border-[#eddcd4] bg-white p-5 shadow-2xs">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold text-neutral-500">Total Items</p>
          <div className="size-8 rounded-xl bg-neutral-100 border border-neutral-200 flex items-center justify-center text-neutral-600">
            <UtensilsCrossed className="size-4" />
          </div>
        </div>
        <p className="mt-3 text-2xl font-bold text-neutral-900">{stats.totalMenuItems}</p>
        <p className="mt-1 text-xs text-neutral-400">All registered dishes & beverages</p>
      </div>

      {/* Available Items */}
      <div className="rounded-2xl border border-[#eddcd4] bg-white p-5 shadow-2xs">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold text-neutral-500">Available In-Stock</p>
          <div className="size-8 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
            <CheckCircle2 className="size-4" />
          </div>
        </div>
        <p className="mt-3 text-2xl font-bold text-emerald-600">{stats.availableItems}</p>
        <p className="mt-1 text-xs text-neutral-400">Ready for customer ordering</p>
      </div>

      {/* Out of Stock */}
      <div className="rounded-2xl border border-[#eddcd4] bg-white p-5 shadow-2xs">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold text-neutral-500">Out of Stock</p>
          <div className="size-8 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600">
            <PackageX className="size-4" />
          </div>
        </div>
        <p className="mt-3 text-2xl font-bold text-rose-600">{stats.outOfStockItems}</p>
        <p className="mt-1 text-xs text-neutral-400">Temporarily unavailable</p>
      </div>
    </div>
  );
}

export default MenuItemStatsCards;
