import { Calendar, ChevronDown, RotateCcw, Search } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ORDER_DATE_RANGE_FILTERS,
  ORDER_DATE_RANGE_OPTIONS,
  RESTAURANT_ORDER_STATUS_FILTERS,
  RESTAURANT_ORDER_STATUS_FILTER_OPTIONS,
} from "@/features/orders/constants/restaurant-orders.constants";
import type {
  OrderDateRangeFilter,
  RestaurantOrderFilterStatus,
} from "@/features/orders/types/restaurant-orders.types";

export interface OrdersFiltersProps {
  searchQuery?: string;
  onSearchChange?: (val: string) => void;
  statusFilter?: RestaurantOrderFilterStatus;
  onStatusChange?: (status: RestaurantOrderFilterStatus) => void;
  dateRange?: OrderDateRangeFilter;
  onDateRangeChange?: (range: OrderDateRangeFilter) => void;
  customStartDate?: string;
  customEndDate?: string;
  onCustomStartDateChange?: (date: string) => void;
  onCustomEndDateChange?: (date: string) => void;
  onClearFilters?: () => void;
}

export function OrdersFilters({
  searchQuery = "",
  onSearchChange,
  statusFilter = RESTAURANT_ORDER_STATUS_FILTERS.ALL,
  onStatusChange,
  dateRange = ORDER_DATE_RANGE_FILTERS.TODAY,
  onDateRangeChange,
  customStartDate = "",
  customEndDate = "",
  onCustomStartDateChange,
  onCustomEndDateChange,
  onClearFilters,
}: OrdersFiltersProps) {
  const [internalSearch, setInternalSearch] = useState(searchQuery);
  const [internalStatus, setInternalStatus] = useState<RestaurantOrderFilterStatus>(statusFilter);
  const [internalDateRange, setInternalDateRange] = useState<OrderDateRangeFilter>(dateRange);
  const [internalStartDate, setInternalStartDate] = useState(customStartDate);
  const [internalEndDate, setInternalEndDate] = useState(customEndDate);

  const currentSearch = onSearchChange ? searchQuery : internalSearch;
  const currentStatus = onStatusChange ? statusFilter : internalStatus;
  const currentDateRange = onDateRangeChange ? dateRange : internalDateRange;
  const currentStartDate = onCustomStartDateChange ? customStartDate : internalStartDate;
  const currentEndDate = onCustomEndDateChange ? customEndDate : internalEndDate;

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

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInternalStartDate(val);
    onCustomStartDateChange?.(val);
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInternalEndDate(val);
    onCustomEndDateChange?.(val);
  };

  const handleResetCustomDates = () => {
    setInternalStartDate("");
    setInternalEndDate("");
    onCustomStartDateChange?.("");
    onCustomEndDateChange?.("");
  };

  const handleClear = () => {
    setInternalSearch("");
    setInternalStatus(RESTAURANT_ORDER_STATUS_FILTERS.ALL);
    setInternalDateRange(ORDER_DATE_RANGE_FILTERS.TODAY);
    setInternalStartDate("");
    setInternalEndDate("");
    onCustomStartDateChange?.("");
    onCustomEndDateChange?.("");
    onClearFilters?.();
  };

  const hasActiveFilters =
    Boolean(currentSearch) ||
    currentStatus !== RESTAURANT_ORDER_STATUS_FILTERS.ALL ||
    currentDateRange !== ORDER_DATE_RANGE_FILTERS.TODAY ||
    Boolean(currentStartDate) ||
    Boolean(currentEndDate);

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
              {ORDER_DATE_RANGE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
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
              {RESTAURANT_ORDER_STATUS_FILTER_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
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

      {/* Custom Date Range Picker Sub-Bar */}
      {currentDateRange === ORDER_DATE_RANGE_FILTERS.CUSTOM && (
        <div className="mt-3 pt-3 border-t border-[#eddcd4]/70 flex flex-wrap items-center justify-between gap-3 animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <span className="inline-flex size-6 items-center justify-center rounded-lg bg-[#fef3ec] text-[#e8631b]">
              <Calendar className="size-3.5" />
            </span>
            <span className="text-xs font-bold text-neutral-800">Custom Date Range</span>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {/* Start Date */}
            <div className="flex items-center gap-1.5 h-9 sm:h-10 px-2.5 sm:px-3 rounded-xl border border-[#eddcd4] bg-[#faf7f5]/60 hover:border-[#e8631b] focus-within:border-[#e8631b] focus-within:ring-1 focus-within:ring-[#e8631b] transition-colors">
              <label
                htmlFor="order-custom-start-date"
                className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-neutral-500 cursor-pointer select-none"
              >
                From
              </label>
              <input
                id="order-custom-start-date"
                type="date"
                value={currentStartDate}
                max={currentEndDate || undefined}
                onChange={handleStartDateChange}
                aria-label="Custom start date"
                className="bg-transparent text-xs font-semibold text-neutral-800 outline-none cursor-pointer"
              />
            </div>

            <span className="text-neutral-400 font-semibold text-xs">to</span>

            {/* End Date */}
            <div className="flex items-center gap-1.5 h-9 sm:h-10 px-2.5 sm:px-3 rounded-xl border border-[#eddcd4] bg-[#faf7f5]/60 hover:border-[#e8631b] focus-within:border-[#e8631b] focus-within:ring-1 focus-within:ring-[#e8631b] transition-colors">
              <label
                htmlFor="order-custom-end-date"
                className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-neutral-500 cursor-pointer select-none"
              >
                To
              </label>
              <input
                id="order-custom-end-date"
                type="date"
                value={currentEndDate}
                min={currentStartDate || undefined}
                onChange={handleEndDateChange}
                aria-label="Custom end date"
                className="bg-transparent text-xs font-semibold text-neutral-800 outline-none cursor-pointer"
              />
            </div>

            {(currentStartDate || currentEndDate) && (
              <button
                type="button"
                onClick={handleResetCustomDates}
                aria-label="Reset custom dates"
                className="inline-flex items-center gap-1 text-xs font-semibold text-[#9a3412] hover:text-[#b4532a] px-2 py-1 rounded-lg hover:bg-[#faf7f5] transition-colors cursor-pointer"
              >
                Reset range
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
