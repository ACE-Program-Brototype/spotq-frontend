/**
 * CancelOrderActions Component
 * Action button group featuring safety-focused "Keep My Order" and destructive "Yes, Cancel Order"
 * with animated loading spinner.
 */

import { Loader2 } from "lucide-react";
import React from "react";
import { Button } from "@/components/ui/button";
import { CANCEL_ORDER_MESSAGES } from "../../constants/cancel-order.constants";

export interface CancelOrderActionsProps {
  onKeepOrder: () => void;
  onConfirmCancel: () => void;
  isPending?: boolean;
  canConfirm?: boolean;
  className?: string;
}

export const CancelOrderActions = React.forwardRef<HTMLButtonElement, CancelOrderActionsProps>(
  function CancelOrderActions(
    { onKeepOrder, onConfirmCancel, isPending = false, canConfirm = true, className = "" },
    ref,
  ) {
    return (
      <div
        data-testid="cancel-order-actions"
        className={`flex flex-col-reverse sm:flex-row items-center justify-end gap-2.5 pt-4 border-t border-neutral-100 ${className}`}
      >
        <Button
          ref={ref}
          type="button"
          variant="outline"
          onClick={onKeepOrder}
          disabled={isPending}
          data-testid="keep-order-button"
          className="w-full sm:w-auto rounded-xl px-5 py-2.5 text-xs sm:text-sm font-semibold text-neutral-700 border-neutral-300 hover:bg-neutral-100 transition-colors"
        >
          {CANCEL_ORDER_MESSAGES.KEEP_ORDER_BUTTON}
        </Button>

        <Button
          type="button"
          onClick={onConfirmCancel}
          disabled={isPending || !canConfirm}
          data-testid="confirm-cancel-button"
          className="w-full sm:w-auto rounded-xl bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white font-semibold text-xs sm:text-sm px-5 py-2.5 shadow-2xs border-none transition-all flex items-center justify-center gap-2"
        >
          {isPending ? (
            <>
              <Loader2 className="size-4 animate-spin shrink-0" aria-hidden="true" />
              <span>{CANCEL_ORDER_MESSAGES.CANCELLING_BUTTON}</span>
            </>
          ) : (
            <span>{CANCEL_ORDER_MESSAGES.CONFIRM_CANCEL_BUTTON}</span>
          )}
        </Button>
      </div>
    );
  },
);

export default CancelOrderActions;
