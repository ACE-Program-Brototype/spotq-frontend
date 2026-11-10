import { CheckCheck, CheckCircle2, Flame, UtensilsCrossed } from "lucide-react";
import { Spinner } from "@/components/common/LoadingIndicator";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";
import { STAFF_STATUS_ACTIONS } from "../../../constants/staff-orders.constants";
import { useUpdateStaffOrderStatus } from "../../../hooks/use-update-staff-order-status";
import type { StaffOrderDetail } from "../../../types/staff-orders.types";

interface StaffOrderStatusActionBarProps {
  order: StaffOrderDetail;
  restaurantId: string;
}

export function StaffOrderStatusActionBar({ order, restaurantId }: StaffOrderStatusActionBarProps) {
  const { mutate: updateStatus, isPending } = useUpdateStaffOrderStatus({
    restaurantId,
    orderNumber: order.orderNumber,
  });

  const actionConfig = STAFF_STATUS_ACTIONS[order.status];

  const handleActionClick = () => {
    if (!actionConfig || isPending) return;

    updateStatus({
      orderId: order.id,
      status: actionConfig.nextStatus,
    });
  };

  const getActionIcon = () => {
    switch (actionConfig?.nextStatus) {
      case "PREPARING":
        return <Flame className="size-4 shrink-0" />;
      case "READY":
        return <UtensilsCrossed className="size-4 shrink-0" />;
      case "COMPLETED":
        return <CheckCheck className="size-4 shrink-0" />;
      default:
        return <CheckCircle2 className="size-4 shrink-0" />;
    }
  };

  // 3 Key Kitchen Statuses: Preparing -> Ready -> Completed
  const isReady = order.status === "READY";
  const isCompleted = order.status === "COMPLETED";

  const isPastPreparing = isReady || isCompleted;
  const isPastReady = isCompleted;

  return (
    <div className="rounded-2xl border border-neutral-200/80 bg-white p-5 shadow-xs space-y-4">
      {/* Card Header */}
      <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-800">
          Order Status Actions
        </h3>
        <span className="text-[11px] text-neutral-400 font-medium">3-Step Preparation</span>
      </div>

      {/* 3 Status Pipeline: Preparing -> Ready -> Completed */}
      <div className="grid grid-cols-3 gap-1.5">
        {/* 1. Preparing */}
        <div
          className={cn(
            "rounded-xl p-2 text-center border transition-all text-xs",
            order.status === "PREPARING"
              ? "bg-amber-50 border-amber-300 text-amber-900 font-bold shadow-2xs"
              : isPastPreparing
                ? "bg-neutral-50 border-neutral-200 text-neutral-500 font-medium"
                : "bg-neutral-50/50 border-neutral-100 text-neutral-400 font-medium",
          )}
        >
          <div className="flex items-center justify-center gap-1 text-[11px]">
            {isPastPreparing ? (
              <CheckCircle2 className="size-3 text-emerald-600 shrink-0" />
            ) : order.status === "PREPARING" ? (
              <span className="size-1.5 rounded-full bg-amber-500 animate-pulse shrink-0" />
            ) : null}
            <span>Preparing</span>
          </div>
        </div>

        {/* 2. Ready */}
        <div
          className={cn(
            "rounded-xl p-2 text-center border transition-all text-xs",
            isReady
              ? "bg-emerald-50 border-emerald-300 text-emerald-900 font-bold shadow-2xs"
              : isPastReady
                ? "bg-neutral-50 border-neutral-200 text-neutral-500 font-medium"
                : "bg-neutral-50/50 border-neutral-100 text-neutral-400 font-medium",
          )}
        >
          <div className="flex items-center justify-center gap-1 text-[11px]">
            {isPastReady ? (
              <CheckCircle2 className="size-3 text-emerald-600 shrink-0" />
            ) : isReady ? (
              <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
            ) : null}
            <span>Ready</span>
          </div>
        </div>

        {/* 3. Completed */}
        <div
          className={cn(
            "rounded-xl p-2 text-center border transition-all text-xs",
            isCompleted
              ? "bg-neutral-100 border-neutral-300 text-neutral-900 font-bold shadow-2xs"
              : "bg-neutral-50/50 border-neutral-100 text-neutral-400 font-medium",
          )}
        >
          <div className="flex items-center justify-center gap-1 text-[11px]">
            {isCompleted ? <CheckCircle2 className="size-3 text-neutral-700 shrink-0" /> : null}
            <span>Completed</span>
          </div>
        </div>
      </div>

      {/* Action Button or Completed Banner */}
      {!actionConfig ? (
        <div className="rounded-xl border border-neutral-200 bg-neutral-50/80 p-3.5 text-center">
          <div className="inline-flex size-8 items-center justify-center rounded-full bg-neutral-100 text-neutral-500 mb-1">
            <CheckCircle2 className="size-4 text-neutral-700" />
          </div>
          <h4 className="text-xs font-bold text-neutral-800">Order Completed</h4>
          <p className="text-[11px] text-neutral-500 mt-0.5">
            All preparation steps have been finished.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          <Button
            type="button"
            size="lg"
            disabled={isPending}
            onClick={handleActionClick}
            className={cn(
              "w-full rounded-xl font-bold text-sm tracking-wide gap-2 h-11 transition-all shadow-xs active:scale-[0.99]",
              actionConfig.buttonClass,
            )}
          >
            {isPending ? (
              <>
                <Spinner size="sm" theme="white" />
                <span>Updating Status...</span>
              </>
            ) : (
              <>
                {getActionIcon()}
                <span>{actionConfig.label}</span>
              </>
            )}
          </Button>

          <p className="text-[11px] text-center text-neutral-400">
            Next status:{" "}
            <span className="font-semibold text-neutral-700">{actionConfig.nextStatus}</span>
          </p>
        </div>
      )}
    </div>
  );
}
