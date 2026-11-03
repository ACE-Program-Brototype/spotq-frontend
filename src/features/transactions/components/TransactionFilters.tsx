/**
 * TransactionFilters Component
 * Search bar, status and method selectors, date range picker, and reset actions.
 */

import { Calendar, RotateCcw, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DATE_PRESET_OPTIONS,
  PAYMENT_METHOD_FILTER,
  TRANSACTION_STATUS_FILTER,
} from "../constants/transaction.constants";
import { TRANSACTION_MESSAGES } from "../constants/transaction-messages.constants";

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
}: TransactionFiltersProps) {
  const isCustomDate = datePreset === DATE_PRESET_OPTIONS.CUSTOM;

  return (
    <div className="space-y-3 bg-white p-4 rounded-2xl border border-neutral-200/80 shadow-2xs">
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
        {/* Live Search Input */}
        <div className="relative flex-1 min-w-[280px]">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-neutral-400 pointer-events-none" />
          <Input
            type="text"
            value={searchInput}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={TRANSACTION_MESSAGES.SEARCH_PLACEHOLDER}
            aria-label={TRANSACTION_MESSAGES.SEARCH_ARIA_LABEL}
            className="pl-10 pr-9 h-10 rounded-xl bg-neutral-50/60 border-neutral-200 text-sm focus-visible:bg-white focus-visible:ring-1 focus-visible:ring-neutral-400"
          />
          {searchInput.length > 0 && (
            <button
              type="button"
              onClick={() => onSearchChange("")}
              aria-label="Clear search"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 p-0.5 rounded-full hover:bg-neutral-100 transition-colors"
            >
              <X className="size-4" />
            </button>
          )}
        </div>

        {/* Filter Controls Group */}
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2">
          {/* Status Dropdown */}
          <div className="w-full sm:w-auto">
            <select
              value={status}
              onChange={(e) => onStatusChange(e.target.value)}
              aria-label={TRANSACTION_MESSAGES.FILTER_STATUS_LABEL}
              className="w-full sm:w-36 h-10 px-3 rounded-xl bg-neutral-50/60 border border-neutral-200 text-xs font-medium text-neutral-700 hover:bg-neutral-100/60 focus:outline-hidden focus:ring-1 focus:ring-neutral-400 cursor-pointer transition-colors"
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
          <div className="w-full sm:w-auto">
            <select
              value={method}
              onChange={(e) => onMethodChange(e.target.value)}
              aria-label={TRANSACTION_MESSAGES.FILTER_METHOD_LABEL}
              className="w-full sm:w-36 h-10 px-3 rounded-xl bg-neutral-50/60 border border-neutral-200 text-xs font-medium text-neutral-700 hover:bg-neutral-100/60 focus:outline-hidden focus:ring-1 focus:ring-neutral-400 cursor-pointer transition-colors"
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
          <div className="w-full sm:w-auto">
            <select
              value={datePreset}
              onChange={(e) => onDatePresetChange(e.target.value)}
              aria-label={TRANSACTION_MESSAGES.FILTER_DATE_LABEL}
              className="w-full sm:w-38 h-10 px-3 rounded-xl bg-neutral-50/60 border border-neutral-200 text-xs font-medium text-neutral-700 hover:bg-neutral-100/60 focus:outline-hidden focus:ring-1 focus:ring-neutral-400 cursor-pointer transition-colors"
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

          {/* Reset Filters Action */}
          {isFiltered && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onResetFilters}
              className="h-10 px-3 rounded-xl border-dashed border-neutral-300 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 gap-1.5 shrink-0"
              title={TRANSACTION_MESSAGES.RESET_FILTERS}
            >
              <RotateCcw className="size-3.5" />
              <span className="hidden sm:inline text-xs font-medium">
                {TRANSACTION_MESSAGES.RESET_FILTERS}
              </span>
            </Button>
          )}
        </div>
      </div>

      {/* Custom Date Pickers (visible only when CUSTOM preset is selected) */}
      {isCustomDate && (
        <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-neutral-100 text-xs">
          <div className="flex items-center gap-2">
            <Calendar className="size-3.5 text-neutral-500" />
            <span className="text-neutral-500">{TRANSACTION_MESSAGES.START_DATE_LABEL}:</span>
            <input
              type="date"
              value={customStartDate}
              onChange={(e) => onCustomStartDateChange(e.target.value)}
              className="h-8 px-2.5 rounded-lg border border-neutral-200 bg-white text-neutral-800 focus:outline-hidden focus:ring-1 focus:ring-neutral-400"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-neutral-500">{TRANSACTION_MESSAGES.END_DATE_LABEL}:</span>
            <input
              type="date"
              value={customEndDate}
              onChange={(e) => onCustomEndDateChange(e.target.value)}
              className="h-8 px-2.5 rounded-lg border border-neutral-200 bg-white text-neutral-800 focus:outline-hidden focus:ring-1 focus:ring-neutral-400"
            />
          </div>
        </div>
      )}
    </div>
  );
}
