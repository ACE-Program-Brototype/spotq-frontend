import { ChevronDown, MapPin, RotateCcw, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CUSTOMER_SORT_OPTIONS } from "../../constants/customer-restaurant.constants";
import type { CustomerSortOptionValue } from "../../types/customer-restaurant.types";

export interface CustomerRestaurantFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  cityQuery: string;
  onCityChange: (value: string) => void;
  selectedSort: CustomerSortOptionValue;
  onSortChange: (sort: CustomerSortOptionValue) => void;
  isFiltered: boolean;
  onResetFilters: () => void;
}

export function CustomerRestaurantFilters({
  searchQuery,
  onSearchChange,
  cityQuery,
  onCityChange,
  selectedSort,
  onSortChange,
  isFiltered,
  onResetFilters,
}: CustomerRestaurantFiltersProps) {
  return (
    <div
      data-testid="customer-restaurant-filters"
      className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-2 sm:gap-3 bg-neutral-50/70 p-2 sm:p-3 rounded-xl sm:rounded-2xl border border-neutral-200/70 shadow-2xs"
    >
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 flex-1">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-3.5 sm:size-4 -translate-y-1/2 text-neutral-400 pointer-events-none" />
          <input
            type="text"
            defaultValue={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search restaurants or dishes..."
            className="h-8.5 sm:h-9.5 w-full rounded-lg sm:rounded-xl border border-neutral-200 bg-white pl-8.5 sm:pl-10 pr-8 text-xs sm:text-sm text-neutral-800 placeholder:text-neutral-400 transition-all focus:border-[#ff6b00] focus:outline-none focus:ring-1 focus:ring-[#ff6b00]/30 shadow-2xs"
          />
          {searchQuery && (
            <button
              type="button"
              aria-label="Clear search"
              onClick={() => onSearchChange("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 text-neutral-400 hover:text-neutral-600 rounded-full cursor-pointer"
            >
              <X className="size-3.5" />
            </button>
          )}
        </div>

        {/* City & Sort Row on mobile, split on tablet/desktop */}
        <div className="flex items-center gap-2 sm:w-auto">
          {/* City Filter Input */}
          <div className="relative flex-1 sm:w-48 lg:w-56">
            <MapPin className="absolute left-3 top-1/2 size-3.5 sm:size-4 -translate-y-1/2 text-neutral-400 pointer-events-none" />
            <input
              type="text"
              defaultValue={cityQuery}
              onChange={(e) => onCityChange(e.target.value)}
              placeholder="Filter by city..."
              className="h-8.5 sm:h-9.5 w-full rounded-lg sm:rounded-xl border border-neutral-200 bg-white pl-8.5 sm:pl-9.5 pr-7 text-xs sm:text-sm text-neutral-800 placeholder:text-neutral-400 transition-all focus:border-[#ff6b00] focus:outline-none focus:ring-1 focus:ring-[#ff6b00]/30 shadow-2xs"
            />
            {cityQuery && (
              <button
                type="button"
                aria-label="Clear city"
                onClick={() => onCityChange("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 text-neutral-400 hover:text-neutral-600 rounded-full cursor-pointer"
              >
                <X className="size-3" />
              </button>
            )}
          </div>

          {/* Sort Selector on Mobile */}
          <div className="relative inline-block sm:hidden shrink-0">
            <select
              value={selectedSort}
              onChange={(e) => onSortChange(e.target.value as CustomerSortOptionValue)}
              aria-label="Sort restaurants"
              className="h-8.5 appearance-none rounded-lg border border-neutral-200 bg-white pl-2.5 pr-7 text-[11px] font-semibold text-neutral-700 shadow-2xs hover:border-neutral-300 focus:border-[#ff6b00] focus:outline-none focus:ring-1 focus:ring-[#ff6b00]/30 cursor-pointer"
            >
              {CUSTOMER_SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2 top-1/2 size-3 -translate-y-1/2 text-neutral-400" />
          </div>

          {/* Reset CTA on Mobile */}
          {isFiltered && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onResetFilters}
              aria-label="Reset filters"
              className="h-8.5 px-2 sm:hidden gap-1 rounded-lg text-[11px] font-semibold text-neutral-600 hover:text-neutral-900 hover:bg-white border border-neutral-200 bg-white cursor-pointer shrink-0"
            >
              <RotateCcw className="size-3" />
            </Button>
          )}
        </div>
      </div>

      {/* Right Controls: Reset CTA & Sort Selector Dropdown on Tablet/Desktop */}
      <div className="hidden sm:flex items-center gap-2.5 justify-end">
        {isFiltered && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onResetFilters}
            className="h-9.5 gap-1.5 rounded-xl text-xs font-semibold text-neutral-600 hover:text-neutral-900 hover:bg-white border border-transparent hover:border-neutral-200 cursor-pointer"
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
            className="h-9.5 appearance-none rounded-xl border border-neutral-200 bg-white pl-3.5 pr-8 text-xs font-semibold text-neutral-700 shadow-2xs hover:border-neutral-300 focus:border-[#ff6b00] focus:outline-none focus:ring-1 focus:ring-[#ff6b00]/30 cursor-pointer"
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
