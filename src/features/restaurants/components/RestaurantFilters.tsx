import { ArrowDown, ArrowUp, ArrowUpDown, Filter, RotateCcw, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  RESTAURANT_FILTER_PLANS,
  RESTAURANT_FILTER_STATUS,
  RESTAURANT_MESSAGES,
  RESTAURANT_SUBSCRIPTION_ACTIVE_FILTER,
  type RestaurantFilterPlanType,
  type RestaurantFilterStatusType,
  type RestaurantSubscriptionActiveFilterType,
} from "../constants/restaurant.constants";
import type { RestaurantSortByType, RestaurantSortOrderType } from "../types/restaurant.types";

export interface RestaurantFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  status: RestaurantFilterStatusType;
  onStatusChange: (status: RestaurantFilterStatusType) => void;
  plan: RestaurantFilterPlanType;
  onPlanChange: (plan: RestaurantFilterPlanType) => void;
  isSubscriptionActive: RestaurantSubscriptionActiveFilterType;
  onSubscriptionActiveChange: (active: RestaurantSubscriptionActiveFilterType) => void;
  sortBy?: RestaurantSortByType;
  onSortByChange?: (sortBy: RestaurantSortByType) => void;
  sortOrder?: RestaurantSortOrderType;
  onToggleSortOrder?: () => void;
  isFiltered: boolean;
  onResetFilters: () => void;
  disabled?: boolean;
}

export function RestaurantFilters({
  search,
  onSearchChange,
  status,
  onStatusChange,
  plan,
  onPlanChange,
  isSubscriptionActive,
  onSubscriptionActiveChange,
  sortBy = "created_at",
  onSortByChange,
  sortOrder = "desc",
  onToggleSortOrder,
  isFiltered,
  onResetFilters,
  disabled = false,
}: RestaurantFiltersProps) {
  return (
    <div
      className="space-y-3 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs"
      data-testid="restaurant-filters"
    >
      <div className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center justify-between">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400 pointer-events-none" />
          <Input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={RESTAURANT_MESSAGES.SEARCH_PLACEHOLDER}
            disabled={disabled}
            className="pl-9 pr-8 h-10 bg-slate-50/60 border-slate-200 rounded-xl text-xs sm:text-sm focus-visible:ring-[#0052cc] focus-visible:bg-white transition-all"
            aria-label="Search restaurants"
          />
          {search && (
            <button
              type="button"
              onClick={() => onSearchChange("")}
              disabled={disabled}
              aria-label="Clear search input"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 rounded-full p-0.5 cursor-pointer"
            >
              <X className="size-3.5" />
            </button>
          )}
        </div>

        {/* Clear Filters button (if filtered) */}
        {isFiltered && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onResetFilters}
            disabled={disabled}
            className="h-10 px-3 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl shrink-0 gap-1.5 cursor-pointer"
          >
            <RotateCcw className="size-3.5" />
            {RESTAURANT_MESSAGES.CLEAR_FILTERS}
          </Button>
        )}
      </div>

      {/* Filter and Sort Select Controls */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 pt-1 border-t border-slate-100">
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 mr-1">
            <Filter className="size-3.5 text-slate-400" />
            <span>{RESTAURANT_MESSAGES.FILTER_LABEL}</span>
          </div>

          {/* Status Filter */}
          <div className="flex items-center">
            <select
              value={status}
              onChange={(e) => onStatusChange(e.target.value as RestaurantFilterStatusType)}
              disabled={disabled}
              aria-label="Filter by restaurant status"
              className="h-8.5 px-3 rounded-lg border border-slate-200 bg-slate-50/70 text-xs font-medium text-slate-700 hover:bg-slate-100/70 focus:outline-none focus:ring-1 focus:ring-[#0052cc] cursor-pointer transition-colors"
            >
              <option value={RESTAURANT_FILTER_STATUS.ALL}>
                {RESTAURANT_MESSAGES.FILTER_STATUS_ALL}
              </option>
              <option value={RESTAURANT_FILTER_STATUS.ACTIVE}>
                {RESTAURANT_MESSAGES.FILTER_STATUS_ACTIVE}
              </option>
              <option value={RESTAURANT_FILTER_STATUS.APPROVED}>
                {RESTAURANT_MESSAGES.FILTER_STATUS_APPROVED}
              </option>
              <option value={RESTAURANT_FILTER_STATUS.REJECTED}>
                {RESTAURANT_MESSAGES.FILTER_STATUS_REJECTED}
              </option>
              <option value={RESTAURANT_FILTER_STATUS.SUSPENDED}>
                {RESTAURANT_MESSAGES.FILTER_STATUS_SUSPENDED}
              </option>
              <option value={RESTAURANT_FILTER_STATUS.INACTIVE}>
                {RESTAURANT_MESSAGES.FILTER_STATUS_INACTIVE}
              </option>
            </select>
          </div>

          {/* Plan Filter */}
          <div className="flex items-center">
            <select
              value={plan}
              onChange={(e) => onPlanChange(e.target.value as RestaurantFilterPlanType)}
              disabled={disabled}
              aria-label="Filter by subscription plan"
              className="h-8.5 px-3 rounded-lg border border-slate-200 bg-slate-50/70 text-xs font-medium text-slate-700 hover:bg-slate-100/70 focus:outline-none focus:ring-1 focus:ring-[#0052cc] cursor-pointer transition-colors"
            >
              <option value={RESTAURANT_FILTER_PLANS.ALL}>
                {RESTAURANT_MESSAGES.FILTER_PLAN_ALL}
              </option>
              <option value={RESTAURANT_FILTER_PLANS.QUEUE_PRO}>
                {RESTAURANT_MESSAGES.FILTER_PLAN_QUEUE_PRO}
              </option>
              <option value={RESTAURANT_FILTER_PLANS.SELF_SERVICE_PRO}>
                {RESTAURANT_MESSAGES.FILTER_PLAN_SELF_SERVICE_PRO}
              </option>
            </select>
          </div>

          {/* Subscription Active Filter */}
          <div className="flex items-center">
            <select
              value={isSubscriptionActive}
              onChange={(e) =>
                onSubscriptionActiveChange(e.target.value as RestaurantSubscriptionActiveFilterType)
              }
              disabled={disabled}
              aria-label="Filter by subscription status"
              className="h-8.5 px-3 rounded-lg border border-slate-200 bg-slate-50/70 text-xs font-medium text-slate-700 hover:bg-slate-100/70 focus:outline-none focus:ring-1 focus:ring-[#0052cc] cursor-pointer transition-colors"
            >
              <option value={RESTAURANT_SUBSCRIPTION_ACTIVE_FILTER.ALL}>
                {RESTAURANT_MESSAGES.FILTER_SUBSCRIPTION_ALL}
              </option>
              <option value={RESTAURANT_SUBSCRIPTION_ACTIVE_FILTER.ACTIVE}>
                {RESTAURANT_MESSAGES.FILTER_SUBSCRIPTION_ACTIVE}
              </option>
              <option value={RESTAURANT_SUBSCRIPTION_ACTIVE_FILTER.INACTIVE}>
                {RESTAURANT_MESSAGES.FILTER_SUBSCRIPTION_INACTIVE}
              </option>
            </select>
          </div>
        </div>

        {/* Sorting Controls */}
        {onSortByChange && (
          <div className="flex items-center gap-1.5">
            <div className="flex items-center gap-1 text-xs font-semibold text-slate-500 mr-0.5">
              <ArrowUpDown className="size-3.5 text-slate-400" />
              <span>{RESTAURANT_MESSAGES.SORT_LABEL}</span>
            </div>

            <select
              value={sortBy}
              onChange={(e) => onSortByChange(e.target.value as RestaurantSortByType)}
              disabled={disabled}
              aria-label="Sort restaurants by"
              className="h-8.5 px-3 rounded-lg border border-slate-200 bg-slate-50/70 text-xs font-medium text-slate-700 hover:bg-slate-100/70 focus:outline-none focus:ring-1 focus:ring-[#0052cc] cursor-pointer transition-colors"
            >
              <option value="created_at">{RESTAURANT_MESSAGES.SORT_DATE_CREATED}</option>
              <option value="restaurant_name">{RESTAURANT_MESSAGES.SORT_RESTAURANT_NAME}</option>
              <option value="owner_name">{RESTAURANT_MESSAGES.SORT_OWNER_NAME}</option>
              <option value="status">{RESTAURANT_MESSAGES.SORT_STATUS}</option>
              <option value="plan">{RESTAURANT_MESSAGES.SORT_PLAN}</option>
              <option value="updated_at">{RESTAURANT_MESSAGES.SORT_LAST_UPDATED}</option>
            </select>

            {onToggleSortOrder && (
              <button
                type="button"
                onClick={onToggleSortOrder}
                disabled={disabled}
                title={`Sort Order: ${sortOrder === "desc" ? "Descending (Newest first)" : "Ascending (Oldest first)"}`}
                aria-label={`Toggle sort order, currently ${sortOrder}`}
                className="flex items-center gap-1 h-8.5 px-2.5 rounded-lg border border-slate-200 bg-slate-50/70 hover:bg-slate-100 text-xs font-semibold text-slate-700 transition-colors cursor-pointer disabled:opacity-50"
              >
                {sortOrder === "desc" ? (
                  <>
                    <ArrowDown className="size-3.5 text-slate-600" />
                    <span>{RESTAURANT_MESSAGES.SORT_DESC}</span>
                  </>
                ) : (
                  <>
                    <ArrowUp className="size-3.5 text-slate-600" />
                    <span>{RESTAURANT_MESSAGES.SORT_ASC}</span>
                  </>
                )}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
