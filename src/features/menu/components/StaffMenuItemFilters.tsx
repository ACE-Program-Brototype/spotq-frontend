/**
 * Staff Menu Item Filters Component
 * Search toolbar, category selector tabs, availability filter, sort dropdown, and view switcher.
 */

import { CheckCircle2, ChevronDown, ListFilter, RotateCcw, Search, X, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils/cn";
import type { MenuCategory } from "../types/menu.types";
import type {
  StaffMenuAvailabilityFilter,
  StaffMenuSortOption,
} from "../types/staff-menu-item.types";

export interface StaffMenuItemFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  categories: MenuCategory[];
  selectedCategoryId: string;
  onCategoryChange: (categoryId: string) => void;
  availabilityFilter: StaffMenuAvailabilityFilter;
  onAvailabilityChange: (filter: StaffMenuAvailabilityFilter) => void;
  sortBy: StaffMenuSortOption;
  sortOrder: "asc" | "desc";
  onSortChange: (field: StaffMenuSortOption) => void;
  onResetFilters: () => void;
  isFiltered: boolean;
  totalCount: number;
}

export function StaffMenuItemFilters({
  searchQuery,
  onSearchChange,
  categories,
  selectedCategoryId,
  onCategoryChange,
  availabilityFilter,
  onAvailabilityChange,
  sortBy,
  onSortChange,
  onResetFilters,
  isFiltered,
}: StaffMenuItemFiltersProps) {
  return (
    <div className="space-y-4 rounded-2xl border border-[#eddcd4] bg-white p-4 sm:p-5 shadow-2xs">
      {/* Top Row: Search Input + Sort + Reset */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search Field */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-neutral-400 pointer-events-none" />
          <Input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search items by name, description, variant or SKU..."
            className="pl-9.5 pr-8 h-10 rounded-xl border-[#eddcd4] bg-[#faf7f5]/60 text-xs sm:text-sm focus-visible:ring-[#e8631b]/30"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange("")}
              aria-label="Clear search"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 size-5 flex items-center justify-center rounded-full text-neutral-400 hover:text-neutral-700 hover:bg-neutral-200/60 transition-colors"
            >
              <X className="size-3.5" />
            </button>
          )}
        </div>

        {/* Right Controls: Sort & Reset */}
        <div className="flex items-center gap-2">
          {/* Sort Select */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value as StaffMenuSortOption)}
              className="h-10 rounded-xl border border-[#eddcd4] bg-[#faf7f5]/60 pl-8 pr-8 text-xs font-medium text-neutral-700 shadow-2xs focus:border-[#e8631b] focus:outline-none focus:ring-1 focus:ring-[#e8631b] appearance-none cursor-pointer"
              aria-label="Sort menu items"
            >
              <option value="displayOrder">Category Display Order</option>
              <option value="price">Price</option>
              <option value="createdAt">Date Created</option>
              <option value="name">Item Name</option>
            </select>
            <div className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-400">
              <ListFilter className="size-3.5 text-neutral-500" />
            </div>
            <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400">
              <ChevronDown className="size-3.5" />
            </div>
          </div>

          {/* Reset Filters Button */}
          {isFiltered && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onResetFilters}
              className="h-10 rounded-xl border-[#eddcd4] text-xs text-neutral-600 hover:text-[#9a3412] hover:bg-[#fef3ec] gap-1 px-3"
            >
              <RotateCcw className="size-3.5" />
              <span className="hidden sm:inline">Reset</span>
            </Button>
          )}
        </div>
      </div>

      {/* Bottom Row: Category Pill Tabs & Availability Filters */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pt-1 border-t border-[#f3e6de]">
        {/* Category Filter Pills (Horizontal scrollable) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <button
            type="button"
            onClick={() => onCategoryChange("ALL")}
            className={cn(
              "px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-all cursor-pointer",
              selectedCategoryId === "ALL"
                ? "bg-[#9a3412] text-white shadow-xs"
                : "bg-[#faf7f5] text-neutral-600 border border-[#eddcd4] hover:bg-[#eddcd4]/60 hover:text-neutral-900",
            )}
          >
            All Categories
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => onCategoryChange(cat.id)}
              className={cn(
                "px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-all cursor-pointer",
                selectedCategoryId === cat.id
                  ? "bg-[#9a3412] text-white shadow-xs"
                  : "bg-[#faf7f5] text-neutral-600 border border-[#eddcd4] hover:bg-[#eddcd4]/60 hover:text-neutral-900",
              )}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Availability Toggle Pills */}
        <div className="flex items-center gap-1 shrink-0">
          <span className="text-xs font-medium text-neutral-400 mr-1 hidden sm:inline">
            Status:
          </span>
          <button
            type="button"
            onClick={() => onAvailabilityChange("ALL")}
            className={cn(
              "px-2.5 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer",
              availabilityFilter === "ALL"
                ? "bg-[#fef3ec] text-[#9a3412] font-bold border border-[#fae2d3]"
                : "text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100",
            )}
          >
            All
          </button>
          <button
            type="button"
            onClick={() => onAvailabilityChange("AVAILABLE")}
            className={cn(
              "px-2.5 py-1 rounded-lg text-xs font-medium transition-colors flex items-center gap-1 cursor-pointer",
              availabilityFilter === "AVAILABLE"
                ? "bg-emerald-50 text-emerald-700 font-bold border border-emerald-200"
                : "text-neutral-500 hover:text-emerald-700 hover:bg-emerald-50/50",
            )}
          >
            <CheckCircle2 className="size-3 text-emerald-600" />
            In Stock
          </button>
          <button
            type="button"
            onClick={() => onAvailabilityChange("UNAVAILABLE")}
            className={cn(
              "px-2.5 py-1 rounded-lg text-xs font-medium transition-colors flex items-center gap-1 cursor-pointer",
              availabilityFilter === "UNAVAILABLE"
                ? "bg-rose-50 text-rose-700 font-bold border border-rose-200"
                : "text-neutral-500 hover:text-rose-700 hover:bg-rose-50/50",
            )}
          >
            <XCircle className="size-3 text-rose-600" />
            86'd Items
          </button>
        </div>
      </div>
    </div>
  );
}
