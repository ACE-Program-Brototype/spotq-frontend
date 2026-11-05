import { ArrowUpDown, RotateCcw, Search, X } from "lucide-react";
import { SUBSCRIBER_FILTER_STATUS, SUBSCRIBER_MESSAGES } from "../constants/subscriber.constants";
import type { SubscriberFilterStatus } from "../types/subscriber.types";

export interface SubscriberFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  status: SubscriberFilterStatus;
  onStatusChange: (status: SubscriberFilterStatus) => void;
  sortOrder?: "asc" | "desc";
  onToggleSort?: () => void;
  onClearFilters?: () => void;
  isFiltered?: boolean;
  disabled?: boolean;
}

const statusOptions: {
  label: string;
  value: SubscriberFilterStatus;
}[] = [
  { label: SUBSCRIBER_MESSAGES.FILTER_STATUS_ALL, value: SUBSCRIBER_FILTER_STATUS.ALL },
  { label: "Active", value: SUBSCRIBER_FILTER_STATUS.ACTIVE },
  { label: "Pending", value: SUBSCRIBER_FILTER_STATUS.PENDING },
  { label: "Expired", value: SUBSCRIBER_FILTER_STATUS.EXPIRED },
  { label: "Cancelled", value: SUBSCRIBER_FILTER_STATUS.CANCELLED },
  { label: "Past Due", value: SUBSCRIBER_FILTER_STATUS.PAST_DUE },
];

export function SubscriberFilters({
  search,
  onSearchChange,
  status,
  onStatusChange,
  sortOrder = "desc",
  onToggleSort,
  onClearFilters,
  isFiltered = false,
  disabled = false,
}: SubscriberFiltersProps) {
  return (
    <div
      className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between py-2"
      data-testid="subscriber-filters"
    >
      {/* Status Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs sm:text-sm font-semibold text-slate-600 mr-1 select-none">
          {SUBSCRIBER_MESSAGES.FILTER_STATUS_LABEL}
        </span>
        <div
          className="flex flex-wrap items-center gap-1.5"
          role="tablist"
          aria-label="Subscriber status filters"
        >
          {statusOptions.map((opt) => {
            const isSelected = status === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                role="tab"
                aria-selected={isSelected}
                disabled={disabled}
                onClick={() => onStatusChange(opt.value)}
                className={`px-3.5 py-1.5 text-xs sm:text-sm font-medium rounded-full transition-all select-none ${
                  isSelected
                    ? "bg-[#1e3a5f] text-white font-semibold shadow-xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200/80 hover:text-slate-900"
                } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
                data-testid={`subscriber-filter-tab-${opt.value.toLowerCase()}`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Search, Sort, and Reset Actions */}
      <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
        {/* Search Input Box */}
        <div className="relative flex-1 sm:w-72 sm:flex-initial">
          <label htmlFor="subscriber-search-input" className="sr-only">
            {SUBSCRIBER_MESSAGES.SEARCH_PLACEHOLDER}
          </label>
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="size-4 text-slate-400" />
          </div>
          <input
            id="subscriber-search-input"
            type="text"
            value={search}
            disabled={disabled}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={SUBSCRIBER_MESSAGES.SEARCH_PLACEHOLDER}
            className="w-full rounded-xl bg-slate-100/90 border border-transparent py-2 pl-9 pr-9 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20 transition-all"
            data-testid="subscriber-search-input"
          />
          {search && (
            <button
              type="button"
              aria-label="Clear search"
              disabled={disabled}
              onClick={() => onSearchChange("")}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600"
              data-testid="clear-search-button"
            >
              <X className="size-3.5" />
            </button>
          )}
        </div>

        {/* Sort Toggle Button */}
        {onToggleSort && (
          <button
            type="button"
            disabled={disabled}
            onClick={onToggleSort}
            className="flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-medium rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition-colors"
            title={`Sorted ${sortOrder === "desc" ? "Newest First" : "Oldest First"}`}
            data-testid="subscriber-sort-toggle"
          >
            <ArrowUpDown className="size-3.5 text-slate-500" />
            <span className="hidden sm:inline">
              {sortOrder === "desc"
                ? SUBSCRIBER_MESSAGES.SORT_NEWEST
                : SUBSCRIBER_MESSAGES.SORT_OLDEST}
            </span>
          </button>
        )}

        {/* Clear Filters Button */}
        {isFiltered && onClearFilters && (
          <button
            type="button"
            disabled={disabled}
            onClick={onClearFilters}
            className="flex items-center gap-1 px-2.5 py-2 text-xs sm:text-sm font-medium rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            data-testid="clear-filters-button"
          >
            <RotateCcw className="size-3.5" />
            <span>{SUBSCRIBER_MESSAGES.CLEAR_FILTERS}</span>
          </button>
        )}
      </div>
    </div>
  );
}
