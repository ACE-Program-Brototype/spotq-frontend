import { FilterX, Search, Utensils } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { MenuCategory } from "../types/menu-category.types";
import type { MenuItemStatusFilter } from "../types/menu-item.types";

export interface MenuItemFiltersProps {
  searchQuery: string;
  onSearchChange: (val: string) => void;
  categories: MenuCategory[];
  selectedCategoryId: string;
  onCategoryChange: (catId: string) => void;
  statusFilter: MenuItemStatusFilter;
  onStatusChange: (status: MenuItemStatusFilter) => void;
  vegFilter: "ALL" | "VEG" | "NON_VEG";
  onVegFilterChange: (veg: "ALL" | "VEG" | "NON_VEG") => void;
  onResetFilters: () => void;
  isFiltered: boolean;
}

export function MenuItemFilters({
  searchQuery,
  onSearchChange,
  categories,
  selectedCategoryId,
  onCategoryChange,
  statusFilter,
  onStatusChange,
  vegFilter,
  onVegFilterChange,
  onResetFilters,
  isFiltered,
}: MenuItemFiltersProps) {
  return (
    <div className="p-4 sm:p-5 border-b border-[#f3e6de] bg-[#fffcf9] flex flex-col lg:flex-row gap-3.5 items-stretch lg:items-center justify-between">
      {/* Search Input */}
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-neutral-400 pointer-events-none" />
        <Input
          type="text"
          placeholder="Search items by name or category..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 h-10 rounded-xl border-[#eddcd4] bg-white focus:border-[#e8631b] focus:ring-1 focus:ring-[#e8631b] text-xs"
        />
      </div>

      {/* Filter Controls */}
      <div className="flex items-center gap-2.5 flex-wrap">
        {/* Category Dropdown */}
        <div className="relative">
          <select
            value={selectedCategoryId}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="h-10 rounded-xl border border-[#eddcd4] bg-white px-3 pr-8 text-xs font-medium text-neutral-700 shadow-2xs focus:border-[#e8631b] focus:outline-none focus:ring-1 focus:ring-[#e8631b] appearance-none cursor-pointer"
            aria-label="Filter by category"
          >
            <option value="ALL">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400">
            <Utensils className="size-3.5" />
          </div>
        </div>

        {/* Dietary (Veg / Non-Veg) Dropdown */}
        <select
          value={vegFilter}
          onChange={(e) => onVegFilterChange(e.target.value as "ALL" | "VEG" | "NON_VEG")}
          className="h-10 rounded-xl border border-[#eddcd4] bg-white px-3 text-xs font-medium text-neutral-700 shadow-2xs focus:border-[#e8631b] focus:outline-none focus:ring-1 focus:ring-[#e8631b] cursor-pointer"
          aria-label="Filter by dietary preference"
        >
          <option value="ALL">All Diets</option>
          <option value="VEG">Vegetarian</option>
          <option value="NON_VEG">Non-Vegetarian</option>
        </select>

        {/* Stock / Availability Dropdown */}
        <select
          value={statusFilter}
          onChange={(e) => onStatusChange(e.target.value as MenuItemStatusFilter)}
          className="h-10 rounded-xl border border-[#eddcd4] bg-white px-3 text-xs font-medium text-neutral-700 shadow-2xs focus:border-[#e8631b] focus:outline-none focus:ring-1 focus:ring-[#e8631b] cursor-pointer"
          aria-label="Filter by availability status"
        >
          <option value="ALL">All Status</option>
          <option value="AVAILABLE">In Stock</option>
          <option value="OUT_OF_STOCK">Out of Stock</option>
        </select>

        {/* Reset Filters */}
        {isFiltered && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onResetFilters}
            className="h-10 rounded-xl text-neutral-500 hover:text-neutral-900 hover:bg-[#faf0e8] text-xs font-medium gap-1.5 px-3"
          >
            <FilterX className="size-3.5" />
            <span>Clear</span>
          </Button>
        )}
      </div>
    </div>
  );
}

export default MenuItemFilters;
