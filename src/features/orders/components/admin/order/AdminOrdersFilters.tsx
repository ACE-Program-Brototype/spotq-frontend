/**
 * Platform Admin Orders Filters Component
 * Provides comprehensive search, multi-attribute filtering (order status, payment status, date range),
 * sorting triggers, and one-click reset for the platform admin order overview.
 */

import { useQuery } from "@tanstack/react-query";
import { Calendar, ChevronDown, RotateCcw, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ADMIN_DATE_PRESET_OPTIONS,
  ADMIN_ORDER_STATUS_OPTIONS,
  ADMIN_ORDERS_FILTER_LABELS,
  ADMIN_ORDERS_MESSAGES,
  ADMIN_ORDERS_RESTAURANT_FILTER_CONFIG,
  ADMIN_PAYMENT_STATUS_OPTIONS,
  type AdminDatePreset,
} from "@/features/orders/constants/admin-orders.constants";
import type {
  AdminOrderFilterPaymentStatus,
  AdminOrderFilterStatus,
} from "@/features/orders/types/admin-orders.types";
import { restaurantService } from "@/features/restaurants/services/restaurant.service";
import { cn } from "@/lib/utils/cn";

export type { AdminDatePreset };

interface AdminOrdersFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  statusFilter: AdminOrderFilterStatus;
  onStatusChange: (status: AdminOrderFilterStatus) => void;
  paymentStatusFilter: AdminOrderFilterPaymentStatus;
  onPaymentStatusChange: (status: AdminOrderFilterPaymentStatus) => void;
  restaurantFilter?: string;
  onRestaurantFilterChange: (restaurantId?: string) => void;
  datePreset: AdminDatePreset;
  onDatePresetChange: (preset: AdminDatePreset) => void;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
  disabled?: boolean;
}

export function AdminOrdersFilters({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusChange,
  paymentStatusFilter,
  onPaymentStatusChange,
  restaurantFilter,
  onRestaurantFilterChange,
  datePreset,
  onDatePresetChange,
  onClearFilters,
  hasActiveFilters,
  disabled = false,
}: AdminOrdersFiltersProps) {
  const { data: restaurantsData, isLoading: isLoadingRestaurants } = useQuery({
    queryKey: ADMIN_ORDERS_RESTAURANT_FILTER_CONFIG.QUERY_KEY,
    queryFn: () =>
      restaurantService.getAdminRestaurants({
        limit: ADMIN_ORDERS_RESTAURANT_FILTER_CONFIG.LIMIT,
      }),
    staleTime: ADMIN_ORDERS_RESTAURANT_FILTER_CONFIG.STALE_TIME_MS,
  });
  return (
    <div className="space-y-3.5 rounded-2xl border border-slate-200/80 bg-white p-4 sm:p-5 shadow-xs max-w-full overflow-hidden">
      {/* Top Row: Search Input + Date Presets + Clear */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
          <Input
            type="text"
            value={searchQuery}
            disabled={disabled}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={ADMIN_ORDERS_MESSAGES.SEARCH_PLACEHOLDER}
            className="pl-9.5 pr-8 h-10 rounded-xl border-slate-200 bg-slate-50/50 text-xs sm:text-sm placeholder:text-slate-400 focus-visible:bg-white focus-visible:ring-2 focus-visible:ring-[#0052cc]/20 focus-visible:border-[#0052cc]"
          />
          {searchQuery && (
            <button
              type="button"
              disabled={disabled}
              onClick={() => onSearchChange("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 disabled:opacity-40 disabled:pointer-events-none p-0.5 rounded-md transition-colors cursor-pointer"
              aria-label="Clear search"
            >
              <X className="size-3.5" />
            </button>
          )}
        </div>

        {/* Right side controls: Date presets + Clear filters */}
        <div className="flex flex-wrap items-center justify-between sm:justify-start gap-2">
          {/* Date range presets */}
          <div className="flex items-center gap-1 rounded-xl bg-slate-100 p-1 border border-slate-200/60 overflow-x-auto max-w-full scrollbar-none">
            <div className="flex items-center px-1.5 text-slate-400 shrink-0">
              <Calendar className="size-3.5" />
            </div>
            {ADMIN_DATE_PRESET_OPTIONS.map((preset) => {
              const isSelected = datePreset === preset.value;
              return (
                <button
                  key={preset.value}
                  type="button"
                  disabled={disabled}
                  onClick={() => onDatePresetChange(preset.value)}
                  className={cn(
                    "px-2.5 py-1 text-xs font-semibold rounded-lg transition-all shrink-0 cursor-pointer",
                    isSelected
                      ? "bg-white text-[#1e3a5f] shadow-xs"
                      : "text-slate-600 hover:text-slate-900",
                  )}
                >
                  {preset.label}
                </button>
              );
            })}
          </div>

          {/* Reset Filters */}
          {hasActiveFilters && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              disabled={disabled}
              onClick={onClearFilters}
              className="h-9 px-3 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 hover:text-rose-700 gap-1.5 cursor-pointer shrink-0"
            >
              <RotateCcw className="size-3.5" />
              <span>Reset</span>
            </Button>
          )}
        </div>
      </div>

      {/* Mobile View: Restaurant, Status and Payment Dropdowns */}
      <div className="space-y-2.5 pt-2 border-t border-slate-100 sm:hidden">
        {/* Restaurant Select (Mobile) */}
        <div className="space-y-1 min-w-0">
          <label
            htmlFor="mobile-admin-restaurant"
            className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 truncate"
          >
            {ADMIN_ORDERS_FILTER_LABELS.MOBILE_RESTAURANT_LABEL}
          </label>
          <div className="relative">
            <select
              id="mobile-admin-restaurant"
              value={restaurantFilter ?? ""}
              disabled={disabled || isLoadingRestaurants}
              onChange={(e) => onRestaurantFilterChange(e.target.value ? e.target.value : undefined)}
              aria-label={ADMIN_ORDERS_FILTER_LABELS.MOBILE_RESTAURANT_ARIA}
              className="h-10 w-full pl-3 pr-8 rounded-xl border border-slate-200 bg-slate-50/70 text-xs font-semibold text-slate-800 appearance-none focus:outline-none focus:bg-white focus:border-[#0052cc] focus:ring-2 focus:ring-[#0052cc]/20 cursor-pointer shadow-2xs transition-colors"
            >
              <option value="">{ADMIN_ORDERS_FILTER_LABELS.ALL_RESTAURANTS}</option>
              {restaurantsData?.restaurants.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.restaurant_name}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 size-4 text-slate-400 pointer-events-none" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          {/* Order Status Select */}
          <div className="space-y-1 min-w-0">
            <label
              htmlFor="mobile-admin-order-status"
              className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 truncate"
            >
              {ADMIN_ORDERS_FILTER_LABELS.MOBILE_STATUS_LABEL}
            </label>
            <div className="relative">
              <select
                id="mobile-admin-order-status"
                value={statusFilter}
                disabled={disabled}
                onChange={(e) => onStatusChange(e.target.value as AdminOrderFilterStatus)}
                aria-label={ADMIN_ORDERS_FILTER_LABELS.MOBILE_STATUS_ARIA}
                className="h-10 w-full pl-3 pr-8 rounded-xl border border-slate-200 bg-slate-50/70 text-xs font-semibold text-slate-800 appearance-none focus:outline-none focus:bg-white focus:border-[#1e3a5f] focus:ring-2 focus:ring-[#1e3a5f]/20 cursor-pointer shadow-2xs transition-colors"
              >
                {ADMIN_ORDER_STATUS_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 size-4 text-slate-400 pointer-events-none" />
            </div>
          </div>

          {/* Payment Status Select */}
          <div className="space-y-1 min-w-0">
            <label
              htmlFor="mobile-admin-payment-status"
              className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 truncate"
            >
              {ADMIN_ORDERS_FILTER_LABELS.MOBILE_PAYMENT_LABEL}
            </label>
            <div className="relative">
              <select
                id="mobile-admin-payment-status"
                value={paymentStatusFilter}
                disabled={disabled}
                onChange={(e) =>
                  onPaymentStatusChange(e.target.value as AdminOrderFilterPaymentStatus)
                }
                aria-label={ADMIN_ORDERS_FILTER_LABELS.MOBILE_PAYMENT_ARIA}
                className="h-10 w-full pl-3 pr-8 rounded-xl border border-slate-200 bg-slate-50/70 text-xs font-semibold text-slate-800 appearance-none focus:outline-none focus:bg-white focus:border-[#0052cc] focus:ring-2 focus:ring-[#0052cc]/20 cursor-pointer shadow-2xs transition-colors"
              >
                {ADMIN_PAYMENT_STATUS_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 size-4 text-slate-400 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {/* Desktop / Tablet View: Restaurant Select + Filter Chips */}
      <div className="hidden sm:flex sm:flex-col gap-3 pt-3 border-t border-slate-100">
        {/* Row 1: Restaurant Selector (Left) + Payment Status Chips (Right) */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Restaurant Filter Dropdown (Desktop) */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 shrink-0">
              {ADMIN_ORDERS_FILTER_LABELS.RESTAURANT}
            </span>
            <div className="relative">
              <select
                value={restaurantFilter ?? ""}
                disabled={disabled || isLoadingRestaurants}
                onChange={(e) => onRestaurantFilterChange(e.target.value ? e.target.value : undefined)}
                aria-label={ADMIN_ORDERS_FILTER_LABELS.MOBILE_RESTAURANT_ARIA}
                className="h-8 pl-2.5 pr-7 text-xs font-semibold rounded-lg border border-slate-200/80 bg-white text-slate-700 appearance-none focus:outline-none focus:ring-2 focus:ring-[#0052cc]/20 cursor-pointer shadow-2xs transition-colors min-w-[160px] max-w-[220px] truncate"
              >
                <option value="">{ADMIN_ORDERS_FILTER_LABELS.ALL_RESTAURANTS}</option>
                {restaurantsData?.restaurants.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.restaurant_name}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 size-3.5 text-slate-400 pointer-events-none" />
            </div>
          </div>

          {/* Payment Status Chips */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 shrink-0">
              {ADMIN_ORDERS_FILTER_LABELS.PAYMENT}
            </span>
            <div className="flex items-center gap-1.5 flex-wrap">
              {ADMIN_PAYMENT_STATUS_OPTIONS.map((opt) => {
                const isSelected = paymentStatusFilter === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    disabled={disabled}
                    onClick={() => onPaymentStatusChange(opt.value)}
                    className={cn(
                      "px-2.5 py-1 text-xs font-semibold rounded-lg transition-all select-none border cursor-pointer shrink-0",
                      isSelected
                        ? "bg-[#0052cc] text-white border-[#0052cc] shadow-2xs"
                        : "bg-white text-slate-600 border-slate-200/80 hover:bg-slate-50 hover:text-slate-900",
                    )}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Row 2: Order Status Filters (Dedicated row with clean horizontal overflow) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none pt-0.5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 shrink-0">
            {ADMIN_ORDERS_FILTER_LABELS.STATUS}
          </span>
          <div
            className="flex items-center gap-1.5 shrink-0"
            role="tablist"
            aria-label="Order Status"
          >
            {ADMIN_ORDER_STATUS_OPTIONS.map((opt) => {
              const isSelected = statusFilter === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  disabled={disabled}
                  onClick={() => onStatusChange(opt.value)}
                  className={cn(
                    "px-2.5 py-1 text-xs font-semibold rounded-lg transition-all select-none border cursor-pointer shrink-0",
                    isSelected
                      ? "bg-[#1e3a5f] text-white border-[#1e3a5f] shadow-2xs"
                      : "bg-white text-slate-600 border-slate-200/80 hover:bg-slate-50 hover:text-slate-900",
                  )}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
