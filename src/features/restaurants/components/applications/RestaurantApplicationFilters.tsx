import { ArrowUpDown, Calendar, Filter, Search, SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  APPLICATION_FILTER_STATUS,
  APPLICATION_MESSAGES,
  APPLICATION_SORT_OPTIONS,
} from "../../constants/restaurant-application.constants";
import type {
  ApplicationFilterStatusType,
  ApplicationSortByType,
  ApplicationSortOrderType,
} from "../../types/restaurant-application.types";

export interface RestaurantApplicationFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  status: ApplicationFilterStatusType;
  onStatusChange: (status: ApplicationFilterStatusType) => void;
  fromDate: string;
  onFromDateChange: (date: string) => void;
  toDate: string;
  onToDateChange: (date: string) => void;
  sortBy: ApplicationSortByType;
  onSortByChange: (sortBy: ApplicationSortByType) => void;
  sortOrder: ApplicationSortOrderType;
  onToggleSortOrder: () => void;
  isFiltered: boolean;
  onResetFilters: () => void;
  disabled?: boolean;
}

export function RestaurantApplicationFilters({
  search,
  onSearchChange,
  status,
  onStatusChange,
  fromDate,
  onFromDateChange,
  toDate,
  onToDateChange,
  sortBy,
  onSortByChange,
  sortOrder,
  onToggleSortOrder,
  isFiltered,
  onResetFilters,
  disabled = false,
}: RestaurantApplicationFiltersProps) {
  const statusTabs: { label: string; value: ApplicationFilterStatusType }[] = [
    { label: "All Applications", value: APPLICATION_FILTER_STATUS.ALL },
    { label: "Pending Verification", value: APPLICATION_FILTER_STATUS.PENDING },
    { label: "Rejected", value: APPLICATION_FILTER_STATUS.REJECTED },
  ];

  return (
    <div
      className="space-y-3.5 rounded-2xl border border-slate-200/80 bg-white p-4 sm:p-5 shadow-xs"
      data-testid="restaurant-application-filters"
    >
      {/* Top Row: Search and Status Tabs */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3.5">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[280px]">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400 pointer-events-none" />
          <Input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={APPLICATION_MESSAGES.SEARCH_PLACEHOLDER}
            disabled={disabled}
            className="pl-9.5 pr-9 h-10 rounded-xl bg-slate-50/70 border-slate-200 text-xs sm:text-sm focus:bg-white focus:border-[#ff6b00] focus:ring-[#ff6b00]/20 transition-all placeholder:text-slate-400"
            data-testid="application-search-input"
          />
          {search && (
            <button
              type="button"
              onClick={() => onSearchChange("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 rounded-full hover:bg-slate-200/60 transition-colors cursor-pointer"
              aria-label="Clear search"
            >
              <X className="size-3.5" />
            </button>
          )}
        </div>

        {/* Status Filter Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100/80 rounded-xl border border-slate-200/60 self-start lg:self-auto">
          {statusTabs.map((tab) => {
            const isActive = status === tab.value;
            return (
              <button
                key={tab.value}
                type="button"
                onClick={() => onStatusChange(tab.value)}
                disabled={disabled}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  isActive
                    ? "bg-white text-slate-900 shadow-2xs"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"
                }`}
                data-testid={`status-tab-${tab.value.toLowerCase()}`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Secondary Controls: Date Range, Sort Dropdown, and Clear Filters */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
        <div className="flex flex-wrap items-center gap-2.5">
          {/* From Date */}
          <div className="flex items-center gap-1.5 rounded-xl border border-slate-200/80 bg-slate-50/50 px-2.5 py-1 text-xs text-slate-600">
            <Calendar className="size-3.5 text-slate-400" />
            <span className="text-[11px] font-semibold text-slate-500">From:</span>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => onFromDateChange(e.target.value)}
              disabled={disabled}
              className="bg-transparent text-xs text-slate-700 outline-none cursor-pointer"
              data-testid="from-date-input"
            />
          </div>

          {/* To Date */}
          <div className="flex items-center gap-1.5 rounded-xl border border-slate-200/80 bg-slate-50/50 px-2.5 py-1 text-xs text-slate-600">
            <Calendar className="size-3.5 text-slate-400" />
            <span className="text-[11px] font-semibold text-slate-500">To:</span>
            <input
              type="date"
              value={toDate}
              onChange={(e) => onToDateChange(e.target.value)}
              disabled={disabled}
              className="bg-transparent text-xs text-slate-700 outline-none cursor-pointer"
              data-testid="to-date-input"
            />
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-1.5">
            <div className="flex items-center gap-1.5 rounded-xl border border-slate-200/80 bg-slate-50/50 px-2.5 py-1 text-xs text-slate-700">
              <SlidersHorizontal className="size-3.5 text-slate-400" />
              <span className="text-[11px] font-semibold text-slate-500">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => onSortByChange(e.target.value as ApplicationSortByType)}
                disabled={disabled}
                className="bg-transparent text-xs font-semibold text-slate-800 outline-none cursor-pointer pr-1"
                data-testid="sort-by-select"
              >
                {APPLICATION_SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort Order Toggle */}
            <button
              type="button"
              onClick={onToggleSortOrder}
              disabled={disabled}
              className="flex size-8 items-center justify-center rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-colors cursor-pointer shadow-2xs"
              title={`Sort ${sortOrder === "asc" ? "Ascending" : "Descending"} (click to toggle)`}
              data-testid="sort-order-toggle"
            >
              <ArrowUpDown className="size-3.5" />
            </button>
          </div>
        </div>

        {/* Clear Filters Button */}
        {isFiltered && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onResetFilters}
            disabled={disabled}
            className="h-8 px-2.5 text-xs font-semibold text-[#ff6b00] hover:text-[#e05e00] hover:bg-orange-50 rounded-xl gap-1.5 transition-colors cursor-pointer"
            data-testid="clear-filters-btn"
          >
            <Filter className="size-3.5" />
            <span>{APPLICATION_MESSAGES.CLEAR_FILTERS}</span>
          </Button>
        )}
      </div>
    </div>
  );
}
