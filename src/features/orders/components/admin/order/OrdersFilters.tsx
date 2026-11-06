import { Calendar, ChevronDown, RotateCcw, Search } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type {
  OrderDateRangeFilter,
  RestaurantOrderFilterStatus,
} from "../../../types/restaurant-orders.types";

export interface OrdersFiltersProps {
  searchQuery?: string;
  onSearchChange?: (val: string) => void;
  statusFilter?: RestaurantOrderFilterStatus;
  onStatusChange?: (status: RestaurantOrderFilterStatus) => void;
  dateRange?: OrderDateRangeFilter;
  onDateRangeChange?: (range: OrderDateRangeFilter) => void;
  onClearFilters?: () => void;
}

export function OrdersFilters({
  searchQuery = "",
  onSearchChange,
  statusFilter = "ALL",
  onStatusChange,
  dateRange = "TODAY",
  onDateRangeChange,
  onClearFilters,
}: OrdersFiltersProps) {
  const [internalSearch, setInternalSearch] = useState(searchQuery);
  const [internalStatus, setInternalStatus] = useState<RestaurantOrderFilterStatus>(statusFilter);
  const [internalDateRange, setInternalDateRange] = useState<OrderDateRangeFilter>(dateRange);

  const currentSearch = onSearchChange ? searchQuery : internalSearch;
  const currentStatus = onStatusChange ? statusFilter : internalStatus;
  const currentDateRange = onDateRangeChange ? dateRange : internalDateRange;

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInternalSearch(val);
    onSearchChange?.(val);
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value as RestaurantOrderFilterStatus;
    setInternalStatus(val);
    onStatusChange?.(val);
  };

  const handleDateRangeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value as OrderDateRangeFilter;
    setInternalDateRange(val);
    onDateRangeChange?.(val);
  };

  const handleClear = () => {
    setInternalSearch("");
    setInternalStatus("ALL");
    setInternalDateRange("TODAY");
    onClearFilters?.();
  };

  const hasActiveFilters =
    Boolean(currentSearch) || currentStatus !== "ALL" || currentDateRange !== "TODAY";

  return (
    <div className="rounded-2xl border border-[#eddcd4] bg-white p-4 sm:p-5 shadow-2xs">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        {/* Left: Search input */}
        <div className="relative flex-1 max-w-lg">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-neutral-400" />
          <Input
            type="text"
            placeholder="Search by order number (e.g. ORD-9281)..."
            value={currentSearch}
            onChange={handleSearchChange}
            className="pl-10 h-10 rounded-xl border-[#eddcd4] bg-[#faf7f5]/40 focus:bg-white focus:border-[#e8631b] focus:ring-1 focus:ring-[#e8631b] text-xs sm:text-sm"
          />
        </div>

        {/* Right: Date Range, Status & Clear Button */}
        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
          {/* Date range selector */}
          <div className="relative min-w-[140px]">
            <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 flex items-center text-neutral-400">
              <Calendar className="size-3.5 text-[#e8631b]" />
            </div>
            <select
              value={currentDateRange}
              onChange={handleDateRangeChange}
              aria-label="Filter by date range"
              className="h-10 w-full pl-8 pr-8 rounded-xl border border-[#eddcd4] bg-white text-xs font-medium text-neutral-700 hover:bg-[#faf7f5] appearance-none focus:outline-none focus:border-[#e8631b] cursor-pointer shadow-2xs transition-colors"
            >
              <option value="TODAY">Today</option>
              <option value="LAST_7_DAYS">Last 7 Days</option>
              <option value="CUSTOM">Custom Range</option>
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 size-3.5 text-neutral-400 pointer-events-none" />
          </div>

          {/* Status selector */}
          <div className="relative min-w-[130px]">
            <select
              value={currentStatus}
              onChange={handleStatusChange}
              aria-label="Filter by order status"
              className="h-10 w-full pl-3 pr-8 rounded-xl border border-[#eddcd4] bg-white text-xs font-medium text-neutral-700 hover:bg-[#faf7f5] appearance-none focus:outline-none focus:border-[#e8631b] cursor-pointer shadow-2xs transition-colors"
            >
              <option value="ALL">All Statuses</option>
              <option value="PLACED">Placed</option>
              <option value="PREPARING">Preparing</option>
              <option value="READY">Ready</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 size-3.5 text-neutral-400 pointer-events-none" />
          </div>

          {/* Clear filters button */}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleClear}
            disabled={!hasActiveFilters}
            className="h-10 px-3 text-xs font-semibold text-neutral-600 hover:text-neutral-900 hover:bg-[#faf7f5] rounded-xl border border-transparent hover:border-[#eddcd4] transition-all disabled:opacity-40 disabled:hover:bg-transparent"
          >
            <RotateCcw className="size-3.5 mr-1.5 text-neutral-400" />
            <span>Clear Filters</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
