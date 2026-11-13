/**
 * Platform Admin Orders Empty State Component
 * Displayed when no orders exist or when filter combinations produce no results.
 */

import { RotateCcw, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ADMIN_ORDERS_MESSAGES } from "@/features/orders/constants/admin-orders.constants";

interface AdminOrdersEmptyStateProps {
  hasActiveFilters?: boolean;
  onResetFilters?: () => void;
}

export function AdminOrdersEmptyState({
  hasActiveFilters = false,
  onResetFilters,
}: AdminOrdersEmptyStateProps) {
  return (
    <div
      data-testid="admin-orders-empty-state"
      className="flex flex-col items-center justify-center rounded-2xl bg-white p-12 text-center border border-dashed border-slate-200 shadow-2xs"
    >
      <div className="flex size-14 items-center justify-center rounded-2xl bg-slate-50 text-slate-400 border border-slate-100 mb-4 shadow-2xs">
        <ShoppingBag className="size-7" />
      </div>

      <h3 className="text-base sm:text-lg font-bold text-slate-900">
        {ADMIN_ORDERS_MESSAGES.NO_ORDERS_FOUND_TITLE}
      </h3>

      <p className="mt-1.5 max-w-sm text-xs sm:text-sm text-slate-500">
        {ADMIN_ORDERS_MESSAGES.NO_ORDERS_FOUND_DESC}
      </p>

      {hasActiveFilters && onResetFilters && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onResetFilters}
          className="mt-5 rounded-xl border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 gap-1.5"
        >
          <RotateCcw className="size-3.5 text-slate-500" />
          <span>Reset Filters</span>
        </Button>
      )}
    </div>
  );
}
