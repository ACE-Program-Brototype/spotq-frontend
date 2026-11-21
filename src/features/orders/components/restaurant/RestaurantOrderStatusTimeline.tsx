import { History } from "lucide-react";
import { OrderStatusBadge } from "@/features/orders/components/admin/order/OrderStatusBadge";
import type { RestaurantOrderDetail } from "@/features/orders/types/restaurant-orders.types";
import { formatDate } from "@/lib/utils/date";

interface RestaurantOrderStatusTimelineProps {
  statusHistory: RestaurantOrderDetail["statusHistory"];
}

export function RestaurantOrderStatusTimeline({
  statusHistory = [],
}: RestaurantOrderStatusTimelineProps) {
  if (!statusHistory || statusHistory.length === 0) {
    return null;
  }

  return (
    <div className="rounded-2xl border border-[#eddcd4] bg-white p-4 sm:p-5 shadow-2xs">
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[#f3e6de]">
        <History className="size-4 text-[#e8631b]" />
        <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-800">
          Order Status History
        </h3>
      </div>

      <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#eddcd4]">
        {statusHistory.map((history) => (
          <div
            key={`${history.currentStatus}-${history.createdAt}-${history.changedBy}`}
            className="relative text-xs"
          >
            <span className="absolute -left-6 top-1 size-2.5 rounded-full bg-[#e8631b] ring-4 ring-white" />
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <div className="flex items-center gap-2">
                <OrderStatusBadge status={history.currentStatus} size="sm" />
                <span className="font-semibold text-neutral-800">
                  by {history.changedBy}
                </span>
              </div>
              <span className="text-[11px] text-neutral-400">
                {formatDate(history.createdAt)}
              </span>
            </div>
            {history.notes && <p className="mt-1 text-neutral-600 pl-1">{history.notes}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}
