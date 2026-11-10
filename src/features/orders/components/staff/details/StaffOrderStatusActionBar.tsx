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

  if (!actionConfig) {
    return (
      <div className="rounded-2xl border border-neutral-200 bg-neutral-50/80 p-4 sm:p-5 text-center shadow-xs">
        <div className="inline-flex size-10 items-center justify-center rounded-full bg-neutral-100 text-neutral-500 mb-2">
          <CheckCircle2 className="size-5 text-neutral-600" />
        </div>
        <h4 className="text-sm font-bold text-neutral-800">Order Completed</h4>
        <p className="text-xs text-neutral-500 mt-0.5">
          All kitchen and service actions for this order have been completed.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-neutral-200/80 bg-white p-5 shadow-xs space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500">
          Kitchen Workflow Action
        </h3>
        <span className="text-[11px] text-neutral-400 font-medium">Step Next</span>
      </div>

      <Button
        type="button"
        size="lg"
        disabled={isPending}
        onClick={handleActionClick}
        className={cn(
          "w-full rounded-xl font-bold text-sm tracking-wide gap-2 h-12 transition-all shadow-sm active:scale-[0.99]",
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
        Advancing order from <span className="font-semibold">{order.status}</span> to{" "}
        <span className="font-semibold">{actionConfig.nextStatus}</span>
      </p>
    </div>
  );
}
