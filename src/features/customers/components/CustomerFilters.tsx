import { ArrowUpDown, Search, X } from "lucide-react";
import {
  CUSTOMER_FILTER_STATUS,
  CUSTOMER_MESSAGES,
  type CustomerFilterStatusType,
  type CustomerSortOrderType,
} from "../constants/customer.constants";

export interface CustomerFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  status: CustomerFilterStatusType;
  onStatusChange: (status: CustomerFilterStatusType) => void;
  sortOrder?: CustomerSortOrderType;
  onToggleSort?: () => void;
  disabled?: boolean;
}

const statusOptions: {
  label: string;
  value: CustomerFilterStatusType;
}[] = [
  { label: CUSTOMER_MESSAGES.STATUS_ALL, value: CUSTOMER_FILTER_STATUS.ALL },
  { label: CUSTOMER_MESSAGES.STATUS_ACTIVE, value: CUSTOMER_FILTER_STATUS.ACTIVE },
  { label: CUSTOMER_MESSAGES.STATUS_INACTIVE, value: CUSTOMER_FILTER_STATUS.INACTIVE },
  { label: CUSTOMER_MESSAGES.STATUS_BLOCKED, value: CUSTOMER_FILTER_STATUS.BLOCKED },
];

export function CustomerFilters({
  search,
  onSearchChange,
  status,
  onStatusChange,
  sortOrder = "DESC",
  onToggleSort,
  disabled = false,
}: CustomerFiltersProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between py-2">
      {/* Status Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs sm:text-sm font-semibold text-slate-600 mr-1 select-none">
          {CUSTOMER_MESSAGES.FILTER_STATUS_LABEL}
        </span>
        <div
          className="flex flex-wrap items-center gap-1.5"
          role="tablist"
          aria-label="Customer status filters"
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
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Search and Sort Actions */}
      <div className="flex items-center gap-2 w-full sm:w-auto">
        {/* Search Input Box */}
        <div className="relative w-full sm:w-72">
          <label htmlFor="customer-search-input" className="sr-only">
            {CUSTOMER_MESSAGES.SEARCH_PLACEHOLDER}
          </label>
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="size-4 text-slate-400" />
          </div>
          <input
            id="customer-search-input"
            type="text"
            value={search}
            disabled={disabled}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={CUSTOMER_MESSAGES.SEARCH_PLACEHOLDER}
            className="w-full rounded-xl bg-slate-100/90 border border-transparent py-2 pl-9 pr-9 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20 transition-all"
          />
          {search && (
            <button
              type="button"
              aria-label="Clear search"
              disabled={disabled}
              onClick={() => onSearchChange("")}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600"
            >
              <X className="size-3.5" />
            </button>
          )}
        </div>

        {/* Sort Order Toggle */}
        {onToggleSort && (
          <button
            type="button"
            onClick={onToggleSort}
            disabled={disabled}
            title={
              sortOrder === "DESC"
                ? CUSTOMER_MESSAGES.SORT_NEWEST_FIRST
                : CUSTOMER_MESSAGES.SORT_OLDEST_FIRST
            }
            aria-label={
              sortOrder === "DESC"
                ? CUSTOMER_MESSAGES.SORT_NEWEST_FIRST
                : CUSTOMER_MESSAGES.SORT_OLDEST_FIRST
            }
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-xl bg-slate-100 hover:bg-slate-200/80 text-slate-700 transition-colors shrink-0 disabled:opacity-50"
          >
            <ArrowUpDown className="size-3.5 text-slate-500" />
            <span>
              {sortOrder === "DESC"
                ? CUSTOMER_MESSAGES.SORT_NEWEST_FIRST
                : CUSTOMER_MESSAGES.SORT_OLDEST_FIRST}
            </span>
          </button>
        )}
      </div>
    </div>
  );
}

export default CustomerFilters;
