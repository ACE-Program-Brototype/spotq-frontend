import { History } from "lucide-react";
import { formatDate } from "@/lib/utils/date";
import type { CustomerOrderStatusHistory } from "../../types/customer-order-details.types";

export interface OrderStatusHistoryTimelineProps {
  statusHistory: CustomerOrderStatusHistory[];
  className?: string;
}

export function OrderStatusHistoryTimeline({
  statusHistory,
  className = "",
}: OrderStatusHistoryTimelineProps) {
  if (!statusHistory || statusHistory.length === 0) {
    return null;
  }

  return (
    <div
      data-testid="order-status-history-card"
      className={`rounded-2xl border border-neutral-200/80 bg-white p-5 shadow-2xs space-y-4 ${className}`}
    >
      <div className="flex items-center gap-2 pb-2 border-b border-neutral-100">
        <History className="size-4 text-[#e8631b]" />
        <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-800">
          Status Audit Trail
        </h3>
      </div>

      <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-neutral-200">
        {statusHistory.map((history) => (
          <div
            key={`${history.current_status}-${history.created_at}`}
            data-testid="status-history-item"
            className="relative text-xs space-y-0.5"
          >
            <span className="absolute -left-6 top-1 size-2 rounded-full bg-[#e8631b] ring-4 ring-white" />
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <span className="font-bold text-neutral-900">{history.current_status}</span>
              <span className="text-[11px] text-neutral-400 font-medium">
                {formatDate(history.created_at)}
              </span>
            </div>
            {history.notes && (
              <p className="text-[11px] text-neutral-500 font-normal">{history.notes}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
