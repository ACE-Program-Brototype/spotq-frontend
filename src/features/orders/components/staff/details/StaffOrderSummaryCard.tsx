import { Clock, Info, Layers, Ticket, Utensils } from "lucide-react";
import { formatTime } from "@/lib/utils/date";
import {
  STAFF_ORDER_STATUS_CONFIG,
  STAFF_ORDER_TYPE_CONFIG,
} from "../../../constants/staff-orders.constants";
import type { StaffOrderDetail } from "../../../types/staff-orders.types";

interface StaffOrderSummaryCardProps {
  order: StaffOrderDetail;
}

export function StaffOrderSummaryCard({ order }: StaffOrderSummaryCardProps) {
  const statusConfig = STAFF_ORDER_STATUS_CONFIG[order.status];
  const typeConfig = STAFF_ORDER_TYPE_CONFIG[order.orderType];

  return (
    <div className="rounded-2xl border border-neutral-200/80 bg-white p-5 shadow-xs space-y-4">
      <div className="flex items-center gap-2 border-b border-neutral-100 pb-3">
        <Info className="size-4 text-[#e8631b]" />
        <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-800">
          Order Overview
        </h3>
      </div>

      <div className="space-y-3 text-xs">
        {/* Total Quantity & Line items */}
        <div className="flex items-center justify-between p-2.5 rounded-xl bg-neutral-50/80 border border-neutral-100">
          <span className="flex items-center gap-1.5 text-neutral-500 font-medium">
            <Layers className="size-3.5 text-neutral-400" />
            <span>Total Quantity</span>
          </span>
          <span className="font-bold text-neutral-900 font-mono">
            {order.totalQuantity} {order.totalQuantity === 1 ? "item" : "items"} (
            {order.items.length} unique)
          </span>
        </div>

        {/* Order Mode */}
        <div className="flex items-center justify-between p-2.5 rounded-xl bg-neutral-50/80 border border-neutral-100">
          <span className="text-neutral-500 font-medium">Service Mode</span>
          <span className="font-bold text-neutral-800">{typeConfig?.label ?? order.orderType}</span>
        </div>

        {/* Location Reference (Table or Queue) */}
        {(order.tableNumber !== null || order.queueId) && (
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-neutral-50/80 border border-neutral-100">
            <span className="text-neutral-500 font-medium">
              {order.tableNumber !== null ? "Table Reference" : "Queue Token"}
            </span>
            <span className="font-bold text-neutral-900 inline-flex items-center gap-1">
              {order.tableNumber !== null ? (
                <>
                  <Utensils className="size-3 text-amber-600" />
                  <span>Table {order.tableNumber}</span>
                </>
              ) : (
                <>
                  <Ticket className="size-3 text-purple-600" />
                  <span>Queue #{order.queueId?.slice(0, 8)}</span>
                </>
              )}
            </span>
          </div>
        )}

        {/* Current Status */}
        <div className="flex items-center justify-between p-2.5 rounded-xl bg-neutral-50/80 border border-neutral-100">
          <span className="text-neutral-500 font-medium">Kitchen Status</span>
          <span className="font-bold text-neutral-800 flex items-center gap-1.5">
            <span
              className={`size-1.5 rounded-full ${statusConfig?.dotClass ?? "bg-neutral-500"}`}
            />
            {statusConfig?.label ?? order.status}
          </span>
        </div>

        {/* Placed At */}
        <div className="flex items-center justify-between p-2.5 rounded-xl bg-neutral-50/80 border border-neutral-100">
          <span className="flex items-center gap-1.5 text-neutral-500 font-medium">
            <Clock className="size-3.5 text-neutral-400" />
            <span>Time Placed</span>
          </span>
          <span className="font-bold text-neutral-900 font-mono">
            {formatTime(order.createdAt)}
          </span>
        </div>
      </div>
    </div>
  );
}
