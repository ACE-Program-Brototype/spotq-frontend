import { ArrowLeft, Calendar, Flame, Ticket, Timer, Utensils } from "lucide-react";
import { Link } from "react-router-dom";
import { STAFF_ROUTES } from "@/app/router/staff/staff.routes.constants";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils/cn";
import { formatDate } from "@/lib/utils/date";
import {
  STAFF_ORDER_STATUS_CONFIG,
  STAFF_ORDER_TYPE_CONFIG,
} from "../../../constants/staff-orders.constants";
import { useElapsedTimer } from "../../../hooks/use-elapsed-timer";
import type { StaffOrderDetail } from "../../../types/staff-orders.types";

interface StaffOrderDetailHeaderProps {
  order: StaffOrderDetail;
}

export function StaffOrderDetailHeader({ order }: StaffOrderDetailHeaderProps) {
  const { formattedElapsed, urgency } = useElapsedTimer(order.createdAt);
  const statusConfig = STAFF_ORDER_STATUS_CONFIG[order.status];
  const typeConfig = STAFF_ORDER_TYPE_CONFIG[order.orderType];

  return (
    <div className="space-y-4">
      {/* Back to Orders Link */}
      <div>
        <Link
          to={STAFF_ROUTES.ORDERS}
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-neutral-600 hover:text-[#9a3412] transition-colors group"
        >
          <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-0.5" />
          <span>Back to Orders</span>
        </Link>
      </div>

      {/* Main Header Card */}
      <div className="rounded-2xl border border-neutral-200/80 bg-white p-4 sm:p-6 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Left details */}
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-2xl sm:text-3xl font-black font-mono tracking-tight text-neutral-900">
                {order.orderNumber}
              </h1>

              {/* Status Badge */}
              <span
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold border",
                  statusConfig?.badgeClass ?? "bg-neutral-50 text-neutral-700",
                )}
              >
                <span
                  className={cn("size-2 rounded-full", statusConfig?.dotClass ?? "bg-neutral-500")}
                />
                {statusConfig?.label ?? order.status}
              </span>

              {/* Order Type Badge */}
              <Badge
                variant="outline"
                className={cn(
                  "rounded-full px-2.5 py-0.5 text-xs font-bold border",
                  typeConfig?.badgeClass ?? "bg-neutral-50 text-neutral-600",
                )}
              >
                {typeConfig?.label ?? order.orderType}
              </Badge>

              {/* Queue Badge (if present) */}
              {order.queueId && (
                <span className="inline-flex items-center gap-1 rounded-full bg-purple-50 px-2.5 py-0.5 text-xs font-bold text-purple-700 border border-purple-200">
                  <Ticket className="size-3 text-purple-600" />
                  <span>Queue #{order.queueId.slice(0, 8)}</span>
                </span>
              )}

              {/* Table Badge (if present) */}
              {order.tableNumber !== null && order.tableNumber !== undefined && (
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-bold text-amber-800 border border-amber-200">
                  <Utensils className="size-3 text-amber-600" />
                  <span>Table {order.tableNumber}</span>
                </span>
              )}

              {/* Priority Badge (if High / VIP) */}
              {order.priority && order.priority !== "NORMAL" && (
                <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2.5 py-0.5 text-xs font-bold text-rose-700 border border-rose-200">
                  <Flame className="size-3 text-rose-600" />
                  <span>{order.priority} Priority</span>
                </span>
              )}
            </div>

            {/* Timestamps */}
            <p className="text-xs text-neutral-500 flex items-center gap-1.5">
              <Calendar className="size-3.5 text-neutral-400" />
              <span>Placed on {formatDate(order.createdAt)}</span>
            </p>
          </div>

          {/* Right Live Elapsed Timer */}
          <div className="flex items-center gap-3 shrink-0">
            <div
              className={cn(
                "inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs sm:text-sm font-bold border transition-colors",
                urgency === "normal" && "bg-emerald-50/80 text-emerald-800 border-emerald-200",
                urgency === "warning" && "bg-amber-50/90 text-amber-900 border-amber-300",
                urgency === "critical" &&
                  "bg-rose-50 text-rose-900 border-rose-300 shadow-xs animate-pulse",
              )}
            >
              <Timer
                className={cn(
                  "size-4 shrink-0",
                  urgency === "normal" && "text-emerald-600",
                  urgency === "warning" && "text-amber-600",
                  urgency === "critical" && "text-rose-600",
                )}
              />
              <span className="font-mono tracking-tight">{formattedElapsed}</span>
              <span className="text-[11px] font-medium opacity-80">elapsed</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
