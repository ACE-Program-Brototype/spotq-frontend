import { AlertTriangle, Check, Clock } from "lucide-react";
import { ORDER_TRACKER_STEPS } from "../../constants/customer-order-details.constants";
import type { CustomerOrderStatusHistory } from "../../types/customer-order-details.types";
import type { OrderStatus } from "../../types/orders.types";

export interface OrderStatusTrackerProps {
  status: OrderStatus | string;
  statusHistory?: CustomerOrderStatusHistory[];
  className?: string;
}

const STEP_ORDER: Record<string, number> = {
  PLACED: 0,
  CONFIRMED: 1,
  PREPARING: 2,
  READY: 3,
  SERVED: 3,
  COMPLETED: 4,
};

export function OrderStatusTracker({
  status,
  statusHistory = [],
  className = "",
}: OrderStatusTrackerProps) {
  const isCancelled = status?.toUpperCase() === "CANCELLED";
  const currentStepIndex = STEP_ORDER[status?.toUpperCase()] ?? 0;

  if (isCancelled) {
    return (
      <div
        data-testid="tracker-cancelled-state"
        className={`rounded-2xl border border-rose-200 bg-rose-50/80 p-5 text-rose-900 shadow-2xs ${className}`}
      >
        <div className="flex items-center gap-2.5 font-bold text-rose-800 text-sm">
          <AlertTriangle className="size-5 text-rose-600 shrink-0" />
          <span>Order Cancelled</span>
        </div>
        <p className="mt-1 text-xs text-rose-700">This order has been cancelled.</p>
      </div>
    );
  }

  // Find timestamps for steps from status history
  const getStepTimestamp = (stepKey: string): string | null => {
    const matched = statusHistory.find((h) => h.current_status?.toUpperCase() === stepKey);
    return matched?.created_at
      ? new Date(matched.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      : null;
  };

  return (
    <div
      data-testid="order-status-tracker"
      className={`rounded-2xl border border-neutral-200/80 bg-white p-5 sm:p-6 shadow-2xs space-y-5 ${className}`}
    >
      <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
        <div className="flex items-center gap-2">
          <Clock className="size-4 text-[#e8631b]" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-800">
            Order Status Progression
          </h3>
        </div>
        <span className="text-xs font-semibold text-neutral-500 capitalize">
          Current: <strong className="text-neutral-900">{status}</strong>
        </span>
      </div>

      {/* Progress Bar & Steps */}
      <div className="relative pt-2 pb-1">
        {/* Track Line */}
        <div className="absolute top-6 left-6 right-6 h-1 bg-neutral-100 -translate-y-1/2 z-0 hidden sm:block">
          <div
            className="h-full bg-[#e8631b] transition-all duration-500 ease-in-out"
            style={{
              width: `${(Math.min(currentStepIndex, ORDER_TRACKER_STEPS.length - 1) / (ORDER_TRACKER_STEPS.length - 1)) * 100}%`,
            }}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 sm:gap-2 relative z-10">
          {ORDER_TRACKER_STEPS.map((step, idx) => {
            const isCompleted = idx < currentStepIndex;
            const isCurrent = idx === currentStepIndex;
            const time = getStepTimestamp(step.key);

            return (
              <div
                key={step.key}
                data-testid={`tracker-step-${step.key.toLowerCase()}`}
                className="flex sm:flex-col items-center sm:text-center gap-3 sm:gap-2"
              >
                {/* Step Circle Indicator */}
                <div
                  className={`relative flex size-9 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-all ${
                    isCompleted
                      ? "bg-[#e8631b] text-white shadow-xs"
                      : isCurrent
                        ? "bg-white text-[#e8631b] border-2 border-[#e8631b] ring-4 ring-[#fae2d3]"
                        : "bg-neutral-100 text-neutral-400 border border-neutral-200"
                  }`}
                >
                  {isCompleted ? (
                    <Check className="size-4 stroke-[2.5]" />
                  ) : isCurrent ? (
                    <span className="relative flex size-2.5">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#e8631b] opacity-75" />
                      <span className="relative inline-flex size-2.5 rounded-full bg-[#e8631b]" />
                    </span>
                  ) : (
                    <span>{idx + 1}</span>
                  )}
                </div>

                {/* Step Text Info */}
                <div className="flex-1 min-w-0 sm:flex-initial">
                  <p
                    className={`text-xs font-bold truncate ${
                      isCurrent
                        ? "text-[#e8631b]"
                        : isCompleted
                          ? "text-neutral-900"
                          : "text-neutral-400"
                    }`}
                  >
                    {step.label}
                  </p>
                  {time && <p className="text-[10px] text-neutral-400 font-medium">{time}</p>}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
