/**
 * OrderFilterChips Component
 * Modern segmented filter bar for switching order status filter immediately.
 */

import { cn } from "@/lib/utils/cn";
import { ORDER_FILTER_CHIPS } from "../constants/orders.constants";
import type { OrderFilterStatus } from "../types/orders.types";

export interface OrderFilterChipsProps {
  selectedStatus: OrderFilterStatus;
  onSelect: (status: OrderFilterStatus) => void;
  className?: string;
  disabled?: boolean;
}

function getChipIndicator(value: OrderFilterStatus, isSelected: boolean) {
  if (value === "ALL") return null;

  const colorMap: Record<string, string> = {
    COMPLETED: isSelected ? "bg-white" : "bg-emerald-500",
    CANCELLED: isSelected ? "bg-white" : "bg-rose-500",
    PREPARING: isSelected ? "bg-white animate-pulse" : "bg-amber-500 animate-pulse",
    READY: isSelected ? "bg-white animate-ping" : "bg-blue-500 animate-ping",
    CONFIRMED: isSelected ? "bg-white" : "bg-indigo-500",
    SERVED: isSelected ? "bg-white" : "bg-purple-500",
    PLACED: isSelected ? "bg-white" : "bg-neutral-400",
  };

  const indicatorClass = colorMap[value] || (isSelected ? "bg-white" : "bg-neutral-400");

  return <span className={cn("size-2 rounded-full shrink-0 transition-colors", indicatorClass)} />;
}

export function OrderFilterChips({
  selectedStatus,
  onSelect,
  className,
  disabled = false,
}: OrderFilterChipsProps) {
  return (
    <div
      role="tablist"
      aria-label="Order status filter"
      className={cn(
        "flex flex-wrap items-center gap-1.5 p-1.5 rounded-2xl bg-neutral-100/70 border border-neutral-200/70 backdrop-blur-xs select-none",
        className,
      )}
    >
      {ORDER_FILTER_CHIPS.map((chip) => {
        const isSelected = selectedStatus === chip.value;

        return (
          <button
            key={chip.value}
            type="button"
            role="tab"
            aria-selected={isSelected}
            aria-label={`Filter by ${chip.label}`}
            disabled={disabled}
            onClick={() => onSelect(chip.value)}
            className={cn(
              "inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff6b00] focus-visible:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed",
              isSelected
                ? "bg-[#ff6b00] text-white shadow-xs font-bold"
                : "text-neutral-600 hover:text-neutral-900 hover:bg-white/80",
            )}
          >
            {getChipIndicator(chip.value, isSelected)}
            <span>{chip.label}</span>
          </button>
        );
      })}
    </div>
  );
}

export default OrderFilterChips;
