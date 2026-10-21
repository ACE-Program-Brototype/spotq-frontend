/**
 * OrderHistoryEmptyState Component
 * Displays friendly illustration and call-to-actions when no orders exist or match filter.
 */

import { ShoppingBag, UtensilsCrossed } from "lucide-react";
import { Link } from "react-router-dom";
import { CUSTOMER_ROUTES } from "@/app/router/routes.constants";
import { ORDER_FILTER_STATUS, ORDER_MESSAGES } from "../constants/orders.constants";
import type { OrderFilterStatus } from "../types/orders.types";

export interface OrderHistoryEmptyStateProps {
  statusFilter: OrderFilterStatus;
  onClearFilter?: () => void;
}

export function OrderHistoryEmptyState({
  statusFilter,
  onClearFilter,
}: OrderHistoryEmptyStateProps) {
  const isFiltered = statusFilter !== ORDER_FILTER_STATUS.ALL;

  return (
    <div
      data-testid="order-history-empty-state"
      className="flex flex-col items-center justify-center rounded-3xl bg-neutral-50/70 p-8 sm:p-14 text-center border border-dashed border-neutral-300 gap-4"
    >
      <div className="flex size-16 items-center justify-center rounded-2xl bg-[#fef3ec] text-[#e8631b] border border-[#fae2d3] shadow-xs">
        {isFiltered ? <UtensilsCrossed className="size-8" /> : <ShoppingBag className="size-8" />}
      </div>

      <div className="flex flex-col gap-1.5 max-w-sm">
        <h3 className="text-lg font-bold text-neutral-900">
          {isFiltered ? `No ${statusFilter.toLowerCase()} orders` : ORDER_MESSAGES.NO_ORDERS_TITLE}
        </h3>
        <p className="text-xs sm:text-sm text-neutral-500 leading-relaxed">
          {isFiltered
            ? `You have no past orders matching the "${statusFilter.toLowerCase()}" filter.`
            : ORDER_MESSAGES.NO_ORDERS_SUBTITLE}
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
        {isFiltered && onClearFilter && (
          <button
            type="button"
            onClick={onClearFilter}
            className="inline-flex items-center justify-center rounded-xl bg-neutral-200/80 hover:bg-neutral-300/80 px-4 py-2 text-xs sm:text-sm font-semibold text-neutral-800 transition-colors"
          >
            Show All Orders
          </button>
        )}

        <Link
          to={CUSTOMER_ROUTES.HOME}
          className="inline-flex items-center justify-center rounded-xl bg-[#ff6b00] hover:bg-[#e86100] px-5 py-2 text-xs sm:text-sm font-bold text-white shadow-xs transition-all active:scale-98"
        >
          {ORDER_MESSAGES.EXPLORE_RESTAURANTS}
        </Link>
      </div>
    </div>
  );
}

export default OrderHistoryEmptyState;
