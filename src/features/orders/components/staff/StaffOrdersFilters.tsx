import { ArrowDownUp, RotateCcw, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  STAFF_ORDER_FILTER_STATUS,
  STAFF_ORDER_STATUS_CONFIG,
} from "@/features/orders/constants/staff-orders.constants";
import type {
  StaffOrderFilterStatus,
  StaffOrderSortOrder,
  StaffOrderStatus,
} from "@/features/orders/types/staff-orders.types";
import { cn } from "@/lib/utils/cn";

interface StaffOrdersFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  statusFilter: StaffOrderFilterStatus;
  onStatusChange: (status: StaffOrderFilterStatus) => void;
  sortOrder: StaffOrderSortOrder;
  onToggleSortOrder: () => void;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
}

const STATUS_OPTIONS: Array<{ value: StaffOrderFilterStatus; label: string }> = [
  { value: STAFF_ORDER_FILTER_STATUS.ALL, label: "All Orders" },
  { value: STAFF_ORDER_FILTER_STATUS.PLACED, label: STAFF_ORDER_STATUS_CONFIG.PLACED.label },
  { value: STAFF_ORDER_FILTER_STATUS.CONFIRMED, label: STAFF_ORDER_STATUS_CONFIG.CONFIRMED.label },
  { value: STAFF_ORDER_FILTER_STATUS.PREPARING, label: STAFF_ORDER_STATUS_CONFIG.PREPARING.label },
  { value: STAFF_ORDER_FILTER_STATUS.READY, label: STAFF_ORDER_STATUS_CONFIG.READY.label },
  { value: STAFF_ORDER_FILTER_STATUS.COMPLETED, label: STAFF_ORDER_STATUS_CONFIG.COMPLETED.label },
];

export function StaffOrdersFilters({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusChange,
  sortOrder,
  onToggleSortOrder,
  onClearFilters,
  hasActiveFilters,
}: StaffOrdersFiltersProps) {
  return (
    <div className="space-y-4 rounded-2xl border border-neutral-200/80 bg-white p-4 sm:p-5 shadow-xs">
      {/* Top Row: Search Input + Sort Order Toggle + Clear */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-neutral-400" />
          <Input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by order number (e.g. ORD-001)..."
            className="pl-9.5 pr-8 h-10 rounded-xl border-neutral-200 bg-neutral-50/50 text-xs sm:text-sm placeholder:text-neutral-400 focus-visible:bg-white focus-visible:ring-2 focus-visible:ring-[#e8631b]/20 focus-visible:border-[#e8631b]"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 rounded-full text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100"
            >
              <X className="size-3.5" />
            </button>
          )}
        </div>

        {/* Controls: Sort Toggle + Clear Filters */}
        <div className="flex items-center gap-2">
          {/* Sort Order Toggle */}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onToggleSortOrder}
            title={sortOrder === "asc" ? "Sorted Oldest First (FIFO)" : "Sorted Newest First"}
            className="h-9 px-3 rounded-xl border-neutral-200 text-xs font-semibold hover:bg-neutral-50 gap-1.5"
          >
            <ArrowDownUp className="size-3.5 text-neutral-500" />
            <span>{sortOrder === "asc" ? "Oldest (FIFO)" : "Newest First"}</span>
          </Button>

          {/* Reset Filters */}
          {hasActiveFilters && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onClearFilters}
              className="h-9 px-2.5 text-xs font-semibold text-neutral-500 hover:text-neutral-900 gap-1"
            >
              <RotateCcw className="size-3.5" />
              <span>Reset</span>
            </Button>
          )}
        </div>
      </div>

      {/* Bottom Row: Status Filter Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none pt-1 border-t border-neutral-100">
        <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider mr-1 shrink-0">
          Status:
        </span>
        {STATUS_OPTIONS.map((opt) => {
          const isSelected = statusFilter === opt.value;
          const statusConfig =
            opt.value !== STAFF_ORDER_FILTER_STATUS.ALL
              ? STAFF_ORDER_STATUS_CONFIG[opt.value as StaffOrderStatus]
              : null;

          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onStatusChange(opt.value)}
              className={cn(
                "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 border",
                isSelected
                  ? "bg-[#1c1714] text-white border-[#1c1714] shadow-xs"
                  : "bg-neutral-50 text-neutral-600 border-neutral-200/80 hover:bg-neutral-100 hover:text-neutral-900",
              )}
            >
              {statusConfig && (
                <span
                  className={cn(
                    "size-1.5 rounded-full",
                    isSelected ? "bg-white" : statusConfig.dotClass,
                  )}
                />
              )}
              <span>{opt.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
