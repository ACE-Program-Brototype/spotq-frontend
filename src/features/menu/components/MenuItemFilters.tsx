import { ArrowUpDown, ChevronDown, FilterX, Search, Utensils, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { MenuCategory } from "@/features/menu/types/menu-category.types";
import type {
  MenuItemSortBy,
  MenuItemSortOrder,
  MenuItemStatusFilter,
} from "@/features/menu/types/menu-item.types";

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
  sortBy?: MenuItemSortBy;
  sortOrder?: MenuItemSortOrder;
  onSortChange?: (field: MenuItemSortBy, order: MenuItemSortOrder) => void;
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
  sortBy = "createdAt",
  sortOrder = "desc",
  onSortChange,
  onResetFilters,
  isFiltered,
}: MenuItemFiltersProps) {
  const currentSortKey = `${sortBy}:${sortOrder}`;

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const [field, order] = e.target.value.split(":") as [MenuItemSortBy, MenuItemSortOrder];
    onSortChange?.(field, order);
  };

  return (
    <div className="p-3 sm:p-5 border-b border-[#f3e6de] bg-[#fffcf9] flex flex-col lg:flex-row gap-2.5 sm:gap-3.5 items-stretch lg:items-center justify-between">
      {/* Search Input */}
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 sm:size-4 text-neutral-400 pointer-events-none" />
        <Input
          type="text"
          placeholder="Search items by name or description..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-8.5 pr-8 h-9 sm:h-10 rounded-xl border-[#eddcd4] bg-white focus:border-[#e8631b] focus:ring-1 focus:ring-[#e8631b] text-xs"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => onSearchChange("")}
            aria-label="Clear search"
            className="absolute right-2 top-1/2 -translate-y-1/2 size-5 flex items-center justify-center rounded-full text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors cursor-pointer"
          >
            <X className="size-3" />
          </button>
        )}
      </div>

      {/* Filter & Sort Controls: Arranged in a single line (horizontally scrollable on mobile) */}
      <div className="flex items-center gap-1.5 sm:gap-2.5 overflow-x-auto no-scrollbar py-0.5 -mx-1 px-1 sm:mx-0 sm:px-0 sm:flex-wrap sm:overflow-visible">
        {/* Category Dropdown */}
        <div className="relative shrink-0">
          <select
            value={selectedCategoryId}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="h-8.5 sm:h-10 rounded-xl border border-[#eddcd4] bg-white px-2.5 sm:px-3 pr-7 sm:pr-8 text-xs font-medium text-neutral-700 shadow-2xs focus:border-[#e8631b] focus:outline-none focus:ring-1 focus:ring-[#e8631b] appearance-none cursor-pointer"
            aria-label="Filter by category"
          >
            <option value="ALL">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-neutral-400">
            <Utensils className="size-3 sm:size-3.5" />
          </div>
        </div>

        {/* Dietary (Veg / Non-Veg) Dropdown */}
        <div className="relative shrink-0">
          <select
            value={vegFilter}
            onChange={(e) => onVegFilterChange(e.target.value as "ALL" | "VEG" | "NON_VEG")}
            className="h-8.5 sm:h-10 rounded-xl border border-[#eddcd4] bg-white px-2.5 sm:px-3 pr-6 sm:pr-7 text-xs font-medium text-neutral-700 shadow-2xs focus:border-[#e8631b] focus:outline-none focus:ring-1 focus:ring-[#e8631b] appearance-none cursor-pointer"
            aria-label="Filter by dietary preference"
          >
            <option value="ALL">All Diets</option>
            <option value="VEG">Vegetarian</option>
            <option value="NON_VEG">Non-Veg</option>
          </select>
          <ChevronDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 size-3 text-neutral-400" />
        </div>

        {/* Stock / Availability Dropdown */}
        <div className="relative shrink-0">
          <select
            value={statusFilter}
            onChange={(e) => onStatusChange(e.target.value as MenuItemStatusFilter)}
            className="h-8.5 sm:h-10 rounded-xl border border-[#eddcd4] bg-white px-2.5 sm:px-3 pr-6 sm:pr-7 text-xs font-medium text-neutral-700 shadow-2xs focus:border-[#e8631b] focus:outline-none focus:ring-1 focus:ring-[#e8631b] appearance-none cursor-pointer"
            aria-label="Filter by availability status"
          >
            <option value="ALL">All Status</option>
            <option value="AVAILABLE">In Stock</option>
            <option value="OUT_OF_STOCK">Out of Stock</option>
          </select>
          <ChevronDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 size-3 text-neutral-400" />
        </div>

        {/* Sort Dropdown */}
        {onSortChange && (
          <div className="relative shrink-0">
            <select
              value={currentSortKey}
              onChange={handleSortChange}
              className="h-8.5 sm:h-10 rounded-xl border border-[#eddcd4] bg-white pl-6 sm:pl-7 pr-6 sm:pr-7 text-xs font-medium text-neutral-700 shadow-2xs focus:border-[#e8631b] focus:outline-none focus:ring-1 focus:ring-[#e8631b] appearance-none cursor-pointer"
              aria-label="Sort menu items"
            >
              <option value="createdAt:desc">Newest First</option>
              <option value="createdAt:asc">Oldest First</option>
              <option value="name:asc">Name (A-Z)</option>
              <option value="name:desc">Name (Z-A)</option>
              <option value="price:asc">Price: Low-High</option>
              <option value="price:desc">Price: High-Low</option>
            </select>
            <ArrowUpDown className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 size-3 text-[#e8631b]" />
            <ChevronDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 size-3 text-neutral-400" />
          </div>
        )}

        {/* Reset Filters */}
        {isFiltered && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onResetFilters}
            className="h-8.5 sm:h-10 rounded-xl text-neutral-500 hover:text-neutral-900 hover:bg-[#faf0e8] text-xs font-medium gap-1 px-2.5 shrink-0"
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
