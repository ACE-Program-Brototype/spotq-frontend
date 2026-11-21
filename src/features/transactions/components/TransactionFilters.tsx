/**
 * TransactionFilters Component
 * Search bar, status and method selectors, date range picker, and reset actions.
 * Responsive design:
 * - Desktop: Inline search bar with aligned filter selectors and reset button.
 * - Mobile: Full-width search bar with collapsible filters button (active count badge) and 2-column grid.
 */

import { Calendar, ChevronDown, RotateCcw, Search, SlidersHorizontal, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils/cn";
import {
  DATE_PRESET_OPTIONS,
  PAYMENT_METHOD_FILTER,
  TRANSACTION_STATUS_FILTER,
} from "@/features/transactions/constants/transaction.constants";
import { TRANSACTION_MESSAGES } from "@/features/transactions/constants/transaction-messages.constants";

interface TransactionFiltersProps {
  searchInput: string;
  onSearchChange: (value: string) => void;
  status: string;
  onStatusChange: (status: string) => void;
  method: string;
  onMethodChange: (method: string) => void;
  datePreset: string;
  onDatePresetChange: (preset: string) => void;
  customStartDate: string;
  onCustomStartDateChange: (date: string) => void;
  customEndDate: string;
  onCustomEndDateChange: (date: string) => void;
  isFiltered: boolean;
  onResetFilters: () => void;
  isDateRangeInvalid?: boolean;
}

export function TransactionFilters({
  searchInput,
  onSearchChange,
  status,
  onStatusChange,
  method,
  onMethodChange,
  datePreset,
  onDatePresetChange,
  customStartDate,
  onCustomStartDateChange,
  customEndDate,
  onCustomEndDateChange,
  isFiltered,
  onResetFilters,
  isDateRangeInvalid,
}: TransactionFiltersProps) {
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const isCustomDate = datePreset === DATE_PRESET_OPTIONS.CUSTOM;

  const activeFilterCount =
    (status && status !== TRANSACTION_STATUS_FILTER.ALL ? 1 : 0) +
    (method && method !== PAYMENT_METHOD_FILTER.ALL ? 1 : 0) +
    (datePreset && datePreset !== DATE_PRESET_OPTIONS.ALL ? 1 : 0);

  return (
    <div className="space-y-3 bg-white p-3.5 sm:p-4 rounded-2xl border border-neutral-200/80 shadow-2xs">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Live Search Input */}
        <div className="relative flex-1 min-w-0">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-neutral-400 pointer-events-none" />
          <Input
            type="text"
            value={searchInput}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={TRANSACTION_MESSAGES.SEARCH_PLACEHOLDER}
            aria-label={TRANSACTION_MESSAGES.SEARCH_ARIA_LABEL}
            className="pl-10 pr-9 h-11 sm:h-10 rounded-xl bg-neutral-50/60 border-neutral-200 text-sm focus-visible:bg-white focus-visible:ring-1 focus-visible:ring-neutral-400 truncate"
          />
          {searchInput.length > 0 && (
            <button
              type="button"
              onClick={() => onSearchChange("")}
              aria-label="Clear search"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 p-1 rounded-full hover:bg-neutral-100 transition-colors"
            >
              <X className="size-4" />
            </button>
          )}
        </div>

        {/* Mobile Filter Toggle & Quick Reset Row (sm:hidden) */}
        <div className="flex sm:hidden items-center justify-between gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setIsMobileFiltersOpen((prev) => !prev)}
            aria-expanded={isMobileFiltersOpen}
            aria-controls="transaction-filters-group"
            className="flex-1 h-11 rounded-xl border-neutral-200 bg-neutral-50/60 hover:bg-neutral-100 text-xs font-semibold text-neutral-700 justify-between px-3.5"
          >
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="size-4 text-neutral-500" />
              <span>Filters</span>
              {activeFilterCount > 0 && (
                <span className="flex size-5 items-center justify-center rounded-full bg-[#e8631b] text-[10px] font-bold text-white">
                  {activeFilterCount}
                </span>
              )}
            </div>
            <ChevronDown
              className={cn(
                "size-4 text-neutral-400 transition-transform duration-200",
                isMobileFiltersOpen && "rotate-180",
              )}
            />
          </Button>

          {isFiltered && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onResetFilters}
              className="h-11 px-3.5 rounded-xl border-dashed border-neutral-300 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 gap-1.5 shrink-0"
              aria-label={TRANSACTION_MESSAGES.RESET_FILTERS}
            >
              <RotateCcw className="size-3.5" />
              <span className="text-xs font-medium">Reset</span>
            </Button>
          )}
        </div>

        {/* Filter Controls Group */}
        <div
          id="transaction-filters-group"
          className={cn(
            "grid grid-cols-2 sm:flex sm:flex-nowrap items-center gap-3 sm:gap-2",
            isMobileFiltersOpen ? "grid" : "hidden sm:flex",
          )}
        >
          {/* Status Dropdown */}
          <div className="col-span-1 w-full sm:w-auto">
            <select
              value={status}
              onChange={(e) => onStatusChange(e.target.value)}
              aria-label={TRANSACTION_MESSAGES.FILTER_STATUS_LABEL}
              className="w-full sm:w-36 h-11 sm:h-10 px-3 rounded-xl bg-neutral-50/60 border border-neutral-200 text-xs font-medium text-neutral-700 hover:bg-neutral-100/60 focus:outline-hidden focus:ring-1 focus:ring-neutral-400 cursor-pointer transition-colors"
            >
              <option value={TRANSACTION_STATUS_FILTER.ALL}>
                {TRANSACTION_MESSAGES.STATUS_OPTIONS.ALL}
              </option>
              <option value={TRANSACTION_STATUS_FILTER.SUCCESS}>
                {TRANSACTION_MESSAGES.STATUS_OPTIONS.SUCCESS}
              </option>
              <option value={TRANSACTION_STATUS_FILTER.PENDING}>
                {TRANSACTION_MESSAGES.STATUS_OPTIONS.PENDING}
              </option>
              <option value={TRANSACTION_STATUS_FILTER.FAILED}>
                {TRANSACTION_MESSAGES.STATUS_OPTIONS.FAILED}
              </option>
              <option value={TRANSACTION_STATUS_FILTER.REFUNDED}>
                {TRANSACTION_MESSAGES.STATUS_OPTIONS.REFUNDED}
              </option>
            </select>
          </div>

          {/* Payment Method Dropdown */}
          <div className="col-span-1 w-full sm:w-auto">
            <select
              value={method}
              onChange={(e) => onMethodChange(e.target.value)}
              aria-label={TRANSACTION_MESSAGES.FILTER_METHOD_LABEL}
              className="w-full sm:w-36 h-11 sm:h-10 px-3 rounded-xl bg-neutral-50/60 border border-neutral-200 text-xs font-medium text-neutral-700 hover:bg-neutral-100/60 focus:outline-hidden focus:ring-1 focus:ring-neutral-400 cursor-pointer transition-colors"
            >
              <option value={PAYMENT_METHOD_FILTER.ALL}>
                {TRANSACTION_MESSAGES.METHOD_OPTIONS.ALL}
              </option>
              <option value={PAYMENT_METHOD_FILTER.UPI}>
                {TRANSACTION_MESSAGES.METHOD_OPTIONS.UPI}
              </option>
              <option value={PAYMENT_METHOD_FILTER.CARD}>
                {TRANSACTION_MESSAGES.METHOD_OPTIONS.CARD}
              </option>
              <option value={PAYMENT_METHOD_FILTER.NETBANKING}>
                {TRANSACTION_MESSAGES.METHOD_OPTIONS.NETBANKING}
              </option>
            </select>
          </div>

          {/* Date Preset Dropdown */}
          <div className="col-span-2 sm:col-span-1 w-full sm:w-auto">
            <select
              value={datePreset}
              onChange={(e) => onDatePresetChange(e.target.value)}
              aria-label={TRANSACTION_MESSAGES.FILTER_DATE_LABEL}
              className="w-full sm:w-38 h-11 sm:h-10 px-3 rounded-xl bg-neutral-50/60 border border-neutral-200 text-xs font-medium text-neutral-700 hover:bg-neutral-100/60 focus:outline-hidden focus:ring-1 focus:ring-neutral-400 cursor-pointer transition-colors"
            >
              <option value={DATE_PRESET_OPTIONS.ALL}>
                {TRANSACTION_MESSAGES.DATE_OPTIONS.ALL}
              </option>
              <option value={DATE_PRESET_OPTIONS.TODAY}>
                {TRANSACTION_MESSAGES.DATE_OPTIONS.TODAY}
              </option>
              <option value={DATE_PRESET_OPTIONS.YESTERDAY}>
                {TRANSACTION_MESSAGES.DATE_OPTIONS.YESTERDAY}
              </option>
              <option value={DATE_PRESET_OPTIONS.LAST_7_DAYS}>
                {TRANSACTION_MESSAGES.DATE_OPTIONS.LAST_7_DAYS}
              </option>
              <option value={DATE_PRESET_OPTIONS.THIS_MONTH}>
                {TRANSACTION_MESSAGES.DATE_OPTIONS.THIS_MONTH}
              </option>
              <option value={DATE_PRESET_OPTIONS.CUSTOM}>
                {TRANSACTION_MESSAGES.DATE_OPTIONS.CUSTOM}
              </option>
            </select>
          </div>

          {/* Desktop Reset Filters Action */}
          {isFiltered && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onResetFilters}
              className="hidden sm:inline-flex h-10 px-3 rounded-xl border-dashed border-neutral-300 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 gap-1.5 shrink-0"
              title={TRANSACTION_MESSAGES.RESET_FILTERS}
            >
              <RotateCcw className="size-3.5" />
              <span className="text-xs font-medium">
                {TRANSACTION_MESSAGES.RESET_FILTERS}
              </span>
            </Button>
          )}
        </div>
      </div>

      {/* Custom Date Pickers (visible only when CUSTOM preset is selected) */}
      {isCustomDate && (
        <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3 pt-2.5 border-t border-neutral-100 text-xs">
          <div className="flex items-center gap-2 flex-1 min-w-[200px]">
            <Calendar className="size-4 sm:size-3.5 text-neutral-500 shrink-0" />
            <span className="text-neutral-500 shrink-0">{TRANSACTION_MESSAGES.START_DATE_LABEL}:</span>
            <input
              type="date"
              value={customStartDate}
              onChange={(e) => onCustomStartDateChange(e.target.value)}
              className="h-10 sm:h-8 px-2.5 rounded-lg border border-neutral-200 bg-white text-neutral-800 focus:outline-hidden focus:ring-1 focus:ring-neutral-400 flex-1"
            />
          </div>
          <div className="flex items-center gap-2 flex-1 min-w-[200px]">
            <span className="text-neutral-500 shrink-0">{TRANSACTION_MESSAGES.END_DATE_LABEL}:</span>
            <input
              type="date"
              value={customEndDate}
              onChange={(e) => onCustomEndDateChange(e.target.value)}
              className="h-10 sm:h-8 px-2.5 rounded-lg border border-neutral-200 bg-white text-neutral-800 focus:outline-hidden focus:ring-1 focus:ring-neutral-400 flex-1"
            />
          </div>
          {isDateRangeInvalid && (
            <span className="text-red-500 font-medium text-xs">
              {TRANSACTION_MESSAGES.INVALID_DATE_RANGE}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
