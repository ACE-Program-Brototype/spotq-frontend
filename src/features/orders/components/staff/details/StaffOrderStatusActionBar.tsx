import { CheckCircle2 } from "lucide-react";
import { Spinner } from "@/components/common/LoadingIndicator";
import { Button } from "@/components/ui/button";
import {
  STAFF_KITCHEN_PIPELINE_STEPS,
  STAFF_ORDER_DETAILS_MESSAGES,
  STAFF_ORDER_STATUS,
  STAFF_PIPELINE_STEP_BASE_CLASSES,
  STAFF_STATUS_ACTIONS,
} from "@/features/orders/constants/staff-orders.constants";
import { useUpdateStaffOrderStatus } from "@/features/orders/hooks/use-update-staff-order-status";
import type { StaffOrderDetail } from "@/features/orders/types/staff-orders.types";
import { cn } from "@/lib/utils/cn";

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
  const ActionIcon = actionConfig?.icon ?? CheckCircle2;

  const handleActionClick = () => {
    if (!actionConfig || isPending) return;

    updateStatus({
      orderId: order.id,
      status: actionConfig.nextStatus,
    });
  };

  return (
    <div className="rounded-2xl border border-neutral-200/80 bg-white p-5 shadow-xs space-y-4">
      {/* Card Header */}
      <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-800">
          {STAFF_ORDER_DETAILS_MESSAGES.ACTION_BAR_HEADING}
        </h3>
        <span className="text-[11px] text-neutral-400 font-medium">
          {STAFF_ORDER_DETAILS_MESSAGES.ACTION_BAR_SUBTITLE}
        </span>
      </div>

      {/* 3 Status Pipeline: Preparing -> Ready -> Completed */}
      <div className="grid grid-cols-3 gap-1.5">
        {STAFF_KITCHEN_PIPELINE_STEPS.map((step) => {
          const isCurrent = order.status === step.status;
          const isCompletedStep = step.completedStatuses.includes(order.status);
          const isPast = isCompletedStep && !isCurrent;

          const stepClass = isCurrent
            ? step.activeClass
            : isPast
              ? STAFF_PIPELINE_STEP_BASE_CLASSES.PAST
              : STAFF_PIPELINE_STEP_BASE_CLASSES.UPCOMING;

          return (
            <div
              key={step.status}
              className={cn("rounded-xl p-2 text-center border transition-all text-xs", stepClass)}
            >
              <div className="flex items-center justify-center gap-1 text-[11px]">
                {isPast || (step.status === STAFF_ORDER_STATUS.COMPLETED && isCurrent) ? (
                  <CheckCircle2 className={step.checkIconClass} />
                ) : isCurrent && step.activeDotClass ? (
                  <span className={step.activeDotClass} />
                ) : null}
                <span>{step.label}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Action Button or Completed Banner */}
      {!actionConfig ? (
        <div className="rounded-xl border border-neutral-200 bg-neutral-50/80 p-3.5 text-center">
          <div className="inline-flex size-8 items-center justify-center rounded-full bg-neutral-100 text-neutral-500 mb-1">
            <CheckCircle2 className="size-4 text-neutral-700" />
          </div>
          <h4 className="text-xs font-bold text-neutral-800">
            {STAFF_ORDER_DETAILS_MESSAGES.ORDER_COMPLETED_TITLE}
          </h4>
          <p className="text-[11px] text-neutral-500 mt-0.5">
            {STAFF_ORDER_DETAILS_MESSAGES.ORDER_COMPLETED_DESC}
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
                <span>{STAFF_ORDER_DETAILS_MESSAGES.UPDATING_STATUS}</span>
              </>
            ) : (
              <>
                <ActionIcon className="size-4 shrink-0" />
                <span>{actionConfig.label}</span>
              </>
            )}
          </Button>

          <p className="text-[11px] text-center text-neutral-400">
            {STAFF_ORDER_DETAILS_MESSAGES.NEXT_STATUS_LABEL}{" "}
            <span className="font-semibold text-neutral-700">{actionConfig.nextStatus}</span>
          </p>
        </div>
      )}
    </div>
  );
}
