import { ChevronDown, RotateCcw, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CUSTOMER_SORT_OPTIONS } from "../../constants/customer-restaurant.constants";
import type { CustomerSortOptionValue } from "../../types/customer-restaurant.types";

export interface CustomerRestaurantFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  selectedSort: CustomerSortOptionValue;
  onSortChange: (sort: CustomerSortOptionValue) => void;
  isFiltered: boolean;
  onResetFilters: () => void;
}

export function CustomerRestaurantFilters({
  searchQuery,
  onSearchChange,
  selectedSort,
  onSortChange,
  isFiltered,
  onResetFilters,
}: CustomerRestaurantFiltersProps) {
  return (
    <div
      data-testid="customer-restaurant-filters"
      className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-neutral-50/70 p-3 rounded-2xl border border-neutral-200/70"
    >
      {/* Search Input */}
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-neutral-400 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search restaurants, cuisines, or cities..."
          className="h-9 w-full rounded-xl border border-neutral-200 bg-white pl-10 pr-9 text-xs sm:text-sm text-neutral-800 placeholder:text-neutral-400 transition-all focus:border-[#ff6b00] focus:outline-none focus:ring-1 focus:ring-[#ff6b00]/30 shadow-2xs"
        />
        {searchQuery && (
          <button
            type="button"
            aria-label="Clear search"
            onClick={() => onSearchChange("")}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 text-neutral-400 hover:text-neutral-600 rounded-full cursor-pointer"
          >
            <X className="size-3.5" />
          </button>
        )}
      </div>

      {/* Right Controls: Reset CTA & Sort Selector Dropdown */}
      <div className="flex items-center gap-2.5 justify-between sm:justify-end">
        {isFiltered && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onResetFilters}
            className="h-9 gap-1.5 rounded-xl text-xs font-semibold text-neutral-600 hover:text-neutral-900 hover:bg-white border border-transparent hover:border-neutral-200 cursor-pointer"
          >
            <RotateCcw className="size-3.5" />
            <span>Reset</span>
          </Button>
        )}

        {/* Sort Selector Dropdown */}
        <div className="relative inline-block">
          <select
            value={selectedSort}
            onChange={(e) => onSortChange(e.target.value as CustomerSortOptionValue)}
            aria-label="Sort restaurants"
            className="h-9 appearance-none rounded-xl border border-neutral-200 bg-white pl-3.5 pr-8 text-xs font-semibold text-neutral-700 shadow-2xs hover:border-neutral-300 focus:border-[#ff6b00] focus:outline-none focus:ring-1 focus:ring-[#ff6b00]/30 cursor-pointer"
          >
            {CUSTOMER_SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 size-3.5 -translate-y-1/2 text-neutral-400" />
        </div>
      </div>
    </div>
  );
}
