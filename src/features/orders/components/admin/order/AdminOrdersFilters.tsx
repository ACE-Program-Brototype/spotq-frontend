/**
 * Platform Admin Orders Filters Component
 * Provides comprehensive search, multi-attribute filtering (order status, payment status, date range),
 * sorting triggers, and one-click reset for the platform admin order overview.
 */

import { Calendar, RotateCcw, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ADMIN_ORDER_STATUS_OPTIONS,
  ADMIN_ORDERS_MESSAGES,
  ADMIN_PAYMENT_STATUS_OPTIONS,
} from "@/features/orders/constants/admin-orders.constants";
import type {
  AdminOrderFilterPaymentStatus,
  AdminOrderFilterStatus,
} from "@/features/orders/types/admin-orders.types";
import { cn } from "@/lib/utils/cn";

export type AdminDatePreset = "ALL" | "TODAY" | "LAST_7_DAYS" | "LAST_30_DAYS";

interface AdminOrdersFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  statusFilter: AdminOrderFilterStatus;
  onStatusChange: (status: AdminOrderFilterStatus) => void;
  paymentStatusFilter: AdminOrderFilterPaymentStatus;
  onPaymentStatusChange: (status: AdminOrderFilterPaymentStatus) => void;
  datePreset: AdminDatePreset;
  onDatePresetChange: (preset: AdminDatePreset) => void;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
  disabled?: boolean;
}

const DATE_PRESETS: { label: string; value: AdminDatePreset }[] = [
  { label: "All Time", value: "ALL" },
  { label: "Today", value: "TODAY" },
  { label: "Last 7 Days", value: "LAST_7_DAYS" },
  { label: "Last 30 Days", value: "LAST_30_DAYS" },
];

export function AdminOrdersFilters({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusChange,
  paymentStatusFilter,
  onPaymentStatusChange,
  datePreset,
  onDatePresetChange,
  onClearFilters,
  hasActiveFilters,
  disabled = false,
}: AdminOrdersFiltersProps) {
  return (
    <div className="space-y-3.5 rounded-2xl border border-slate-200/80 bg-white p-4 sm:p-5 shadow-xs">
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
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 disabled:opacity-40 disabled:pointer-events-none p-0.5 rounded-md transition-colors"
              aria-label="Clear search"
            >
              <X className="size-3.5" />
            </button>
          )}
        </div>

        {/* Right side controls: Date presets + Clear filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Date range presets */}
          <div className="flex items-center gap-1 rounded-xl bg-slate-100 p-1 border border-slate-200/60">
            <div className="flex items-center px-1.5 text-slate-400">
              <Calendar className="size-3.5" />
            </div>
            {DATE_PRESETS.map((preset) => {
              const isSelected = datePreset === preset.value;
              return (
                <button
                  key={preset.value}
                  type="button"
                  disabled={disabled}
                  onClick={() => onDatePresetChange(preset.value)}
                  className={cn(
                    "px-2.5 py-1 text-xs font-semibold rounded-lg transition-all",
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
              className="h-9 px-3 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 hover:text-rose-700 gap-1.5"
            >
              <RotateCcw className="size-3.5" />
              <span>Reset</span>
            </Button>
          )}
        </div>
      </div>

      {/* Bottom Row: Status Filter Chips & Payment Status Chips */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-slate-100">
        {/* Order Status Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 shrink-0">
            Status:
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
                    "px-2.5 py-1 text-xs font-semibold rounded-lg transition-all select-none border",
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

        {/* Payment Status Dropdown / Chips */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 shrink-0">
            Payment:
          </span>
          <div className="flex items-center gap-1.5">
            {ADMIN_PAYMENT_STATUS_OPTIONS.map((opt) => {
              const isSelected = paymentStatusFilter === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  disabled={disabled}
                  onClick={() => onPaymentStatusChange(opt.value)}
                  className={cn(
                    "px-2.5 py-1 text-xs font-semibold rounded-lg transition-all select-none border",
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
    </div>
  );
}
