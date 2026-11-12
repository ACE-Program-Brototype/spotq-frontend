import { Clock, Info, Layers, Ticket, Utensils } from "lucide-react";
import {
  STAFF_ORDER_DETAILS_MESSAGES,
  STAFF_ORDER_STATUS_CONFIG,
  STAFF_ORDER_TYPE_CONFIG,
  STAFF_ORDERS_DEFAULTS,
} from "@/features/orders/constants/staff-orders.constants";
import type { StaffOrderDetail } from "@/features/orders/types/staff-orders.types";
import { cn } from "@/lib/utils/cn";
import { formatTime } from "@/lib/utils/date";

interface StaffOrderSummaryCardProps {
  order: StaffOrderDetail;
}

export function StaffOrderSummaryCard({ order }: StaffOrderSummaryCardProps) {
  const statusConfig = STAFF_ORDER_STATUS_CONFIG[order.status];
  const typeConfig = order.orderType ? STAFF_ORDER_TYPE_CONFIG[order.orderType] : null;
  const hasLocationReference =
    (order.tableNumber !== null && order.tableNumber !== undefined) || Boolean(order.queueId);

  return (
    <div className="rounded-2xl border border-neutral-200/80 bg-white p-5 shadow-xs space-y-4">
      <div className="flex items-center gap-2 border-b border-neutral-100 pb-3">
        <Info className="size-4 text-[#e8631b]" />
        <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-800">
          {STAFF_ORDER_DETAILS_MESSAGES.SUMMARY_HEADING}
        </h3>
      </div>

      <div className="space-y-3 text-xs">
        {/* Total Quantity & Line items */}
        <div className="flex items-center justify-between p-2.5 rounded-xl bg-neutral-50/80 border border-neutral-100">
          <span className="flex items-center gap-1.5 text-neutral-500 font-medium">
            <Layers className="size-3.5 text-neutral-400" />
            <span>{STAFF_ORDER_DETAILS_MESSAGES.TOTAL_QUANTITY_LABEL}</span>
          </span>
          <span className="font-bold text-neutral-900 font-mono">
            {STAFF_ORDER_DETAILS_MESSAGES.QUANTITY_BREAKDOWN(
              order.totalQuantity,
              order.items.length,
            )}
          </span>
        </div>

        {/* Order Mode (if present) */}
        {order.orderType && (
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-neutral-50/80 border border-neutral-100">
            <span className="text-neutral-500 font-medium">
              {STAFF_ORDER_DETAILS_MESSAGES.SERVICE_MODE_LABEL}
            </span>
            <span className="font-bold text-neutral-800">
              {typeConfig?.label ?? order.orderType}
            </span>
          </div>
        )}

        {/* Location Reference (Table or Queue) */}
        {hasLocationReference && (
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-neutral-50/80 border border-neutral-100">
            <span className="text-neutral-500 font-medium">
              {order.tableNumber !== null && order.tableNumber !== undefined
                ? STAFF_ORDER_DETAILS_MESSAGES.TABLE_REFERENCE_LABEL
                : STAFF_ORDER_DETAILS_MESSAGES.QUEUE_TOKEN_LABEL}
            </span>
            <span className="font-bold text-neutral-900 inline-flex items-center gap-1">
              {order.tableNumber !== null && order.tableNumber !== undefined ? (
                <>
                  <Utensils className="size-3 text-amber-600" />
                  <span>{STAFF_ORDER_DETAILS_MESSAGES.TABLE_TAG(order.tableNumber)}</span>
                </>
              ) : (
                <>
                  <Ticket className="size-3 text-purple-600" />
                  <span>
                    {STAFF_ORDER_DETAILS_MESSAGES.QUEUE_TAG(
                      order.queueId?.slice(0, STAFF_ORDERS_DEFAULTS.SHORT_ID_LENGTH) ?? "",
                    )}
                  </span>
                </>
              )}
            </span>
          </div>
        )}

        {/* Current Status */}
        <div className="flex items-center justify-between p-2.5 rounded-xl bg-neutral-50/80 border border-neutral-100">
          <span className="text-neutral-500 font-medium">
            {STAFF_ORDER_DETAILS_MESSAGES.KITCHEN_STATUS_LABEL}
          </span>
          <span className="font-bold text-neutral-800 flex items-center gap-1.5">
            <span
              className={cn("size-1.5 rounded-full", statusConfig?.dotClass ?? "bg-neutral-500")}
            />
            {statusConfig?.label ?? order.status}
          </span>
        </div>

        {/* Placed At */}
        <div className="flex items-center justify-between p-2.5 rounded-xl bg-neutral-50/80 border border-neutral-100">
          <span className="flex items-center gap-1.5 text-neutral-500 font-medium">
            <Clock className="size-3.5 text-neutral-400" />
            <span>{STAFF_ORDER_DETAILS_MESSAGES.TIME_PLACED_LABEL}</span>
          </span>
          <span className="font-bold text-neutral-900 font-mono">
            {formatTime(order.createdAt)}
          </span>
        </div>
      </div>
    </div>
  );
}
