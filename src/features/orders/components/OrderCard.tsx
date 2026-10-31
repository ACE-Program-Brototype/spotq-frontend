/**
 * OrderCard Component
 * Modern dining order receipt card featuring rich status badges,
 * itemization metrics, formatted timestamps, and clear pricing.
 */

import {
  Calendar,
  CheckCircle2,
  Clock,
  Sparkles,
  Store,
  UtensilsCrossed,
  XCircle,
} from "lucide-react";
import { CancelOrderTriggerButton } from "@/features/orders/components/cancel-order";
import { cn } from "@/lib/utils/cn";
import { formatDate } from "@/lib/utils/date";
import { ORDER_MESSAGES, ORDER_STATUS } from "../constants/orders.constants";
import type { OrderHistoryItem, OrderStatus } from "../types/orders.types";

export interface OrderCardProps {
  order: OrderHistoryItem;
  className?: string;
  onSelect?: (order: OrderHistoryItem) => void;
}

export function getStatusBadge(status?: OrderStatus | string) {
  const normalized = (status ?? ORDER_STATUS.PLACED).toUpperCase();

  switch (normalized) {
    case ORDER_STATUS.COMPLETED:
      return (
        <span
          data-testid="status-badge"
          className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50/90 px-3 py-1 text-xs font-bold text-emerald-700 border border-emerald-200/80 shadow-2xs backdrop-blur-xs"
        >
          <CheckCircle2 className="size-3.5 text-emerald-600 shrink-0" />
          <span>Completed</span>
        </span>
      );
    case ORDER_STATUS.SERVED:
      return (
        <span
          data-testid="status-badge"
          className="inline-flex items-center gap-1.5 rounded-full bg-purple-50/90 px-3 py-1 text-xs font-bold text-purple-700 border border-purple-200/80 shadow-2xs backdrop-blur-xs"
        >
          <CheckCircle2 className="size-3.5 text-purple-600 shrink-0" />
          <span>Served</span>
        </span>
      );
    case ORDER_STATUS.CANCELLED:
      return (
        <span
          data-testid="status-badge"
          className="inline-flex items-center gap-1.5 rounded-full bg-rose-50/90 px-3 py-1 text-xs font-bold text-rose-700 border border-rose-200/80 shadow-2xs backdrop-blur-xs"
        >
          <XCircle className="size-3.5 text-rose-600 shrink-0" />
          <span>Cancelled</span>
        </span>
      );
    case ORDER_STATUS.READY:
      return (
        <span
          data-testid="status-badge"
          className="inline-flex items-center gap-2 rounded-full bg-blue-50/90 px-3 py-1 text-xs font-bold text-blue-700 border border-blue-200/80 shadow-2xs backdrop-blur-xs"
        >
          <span className="relative flex size-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75" />
            <span className="relative inline-flex size-2 rounded-full bg-blue-600" />
          </span>
          <span>Ready for Pickup</span>
        </span>
      );
    case ORDER_STATUS.PREPARING:
      return (
        <span
          data-testid="status-badge"
          className="inline-flex items-center gap-2 rounded-full bg-amber-50/90 px-3 py-1 text-xs font-bold text-amber-700 border border-amber-200/80 shadow-2xs backdrop-blur-xs"
        >
          <span className="relative flex size-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75" />
            <span className="relative inline-flex size-2 rounded-full bg-amber-500" />
          </span>
          <span>Preparing</span>
        </span>
      );
    case ORDER_STATUS.CONFIRMED:
      return (
        <span
          data-testid="status-badge"
          className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50/90 px-3 py-1 text-xs font-bold text-indigo-700 border border-indigo-200/80 shadow-2xs backdrop-blur-xs"
        >
          <CheckCircle2 className="size-3.5 text-indigo-600 shrink-0" />
          <span>Confirmed</span>
        </span>
      );
    default:
      return (
        <span
          data-testid="status-badge"
          className="inline-flex items-center gap-1.5 rounded-full bg-neutral-100/90 px-3 py-1 text-xs font-semibold text-neutral-700 border border-neutral-200/80 shadow-2xs backdrop-blur-xs"
        >
          <Clock className="size-3.5 text-neutral-500 shrink-0" />
          <span>Placed</span>
        </span>
      );
  }
}

export function OrderCard({ order, className, onSelect }: OrderCardProps) {
  const formattedAmount = `₹${(order.total_amount ?? 0).toFixed(2)}`;
  const formattedDate = formatDate(order.created_at);
  const itemsSummary = `${order.items_count} ${order.items_count === 1 ? "item" : "items"}`;

  return (
    <article
      data-testid={`order-card-${order.order_id}`}
      aria-label={`Order ${order.order_number}, ${order.restaurant_name ? `${order.restaurant_name}, ` : ""}${formattedAmount}, status ${order.status}`}
      onClick={onSelect ? () => onSelect(order) : undefined}
      onKeyDown={
        onSelect
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onSelect(order);
              }
            }
          : undefined
      }
      tabIndex={onSelect ? 0 : undefined}
      role={onSelect ? "button" : undefined}
      className={cn(
        "group relative flex flex-col justify-between overflow-hidden rounded-3xl bg-white p-5 sm:p-6 border border-neutral-200/80 shadow-xs hover:border-[#ff6b00]/40 hover:shadow-lg hover:shadow-neutral-200/40 hover:-translate-y-0.5 transition-all duration-200",
        onSelect &&
          "cursor-pointer focus-visible:outline-2 focus-visible:outline-[#ff6b00] focus-visible:outline-offset-2",
        className,
      )}
    >
      {/* Top subtle decorative gradient bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#ff6b00]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="flex flex-col gap-4">
        {/* Header: Order Number, Icon & Status */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3.5 border-b border-neutral-100">
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#fff2e9] to-[#fde1cb] text-[#e8631b] border border-[#fbd3b7] shadow-2xs group-hover:scale-105 transition-transform duration-200">
              <UtensilsCrossed className="size-5" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h3 className="truncate text-base sm:text-lg font-extrabold tracking-tight text-neutral-900 group-hover:text-[#ff6b00] transition-colors">
                  Order #{order.order_number}
                </h3>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-neutral-500 mt-0.5 min-w-0">
                <Store className="size-3.5 text-neutral-400 shrink-0" />
                <span className="truncate font-semibold text-neutral-700">
                  {order.restaurant_name || ORDER_MESSAGES.DEFAULT_SUBTITLE}
                </span>
              </div>
            </div>
          </div>

          <div className="self-start sm:self-auto shrink-0 flex items-center gap-2">
            {getStatusBadge(order.status)}
            <CancelOrderTriggerButton
              orderId={order.order_id}
              orderNumber={order.order_number}
              status={order.status}
            />
          </div>
        </div>

        {/* Info Pills / Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <div className="flex items-center gap-2.5 rounded-xl bg-neutral-50/80 px-3.5 py-2 border border-neutral-100 text-xs sm:text-sm text-neutral-600">
            <Calendar className="size-4 text-neutral-400 shrink-0" />
            <span className="truncate font-medium">{formattedDate}</span>
          </div>

          <div className="flex items-center gap-2.5 rounded-xl bg-neutral-50/80 px-3.5 py-2 border border-neutral-100 text-xs sm:text-sm text-neutral-600">
            <Sparkles className="size-4 text-amber-500 shrink-0" />
            <span className="truncate font-medium">{itemsSummary}</span>
          </div>
        </div>
      </div>

      {/* Footer: Amount & Receipt Summary */}
      <div className="mt-5 flex items-end justify-between pt-3.5 border-t border-neutral-100">
        <div className="flex flex-col">
          <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">
            Total Paid
          </span>
          <span className="text-xl sm:text-2xl font-black tracking-tight text-neutral-900">
            {formattedAmount}
          </span>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-100/90 text-neutral-500 text-xs font-semibold border border-neutral-200/50">
          <span>Digital Record</span>
        </div>
      </div>
    </article>
  );
}

export default OrderCard;
