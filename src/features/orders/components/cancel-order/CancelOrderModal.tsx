/**
 * CancelOrderModal Component
 * Accessible confirmation alertdialog for reviewing cancellation consequences and submitting structured feedback.
 * Features focus trap, initial focus on "Keep My Order", and responsive layout.
 */

import { AlertDialog as AlertDialogPrimitive } from "@base-ui/react/alert-dialog";
import { X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils/cn";
import {
  CANCEL_ORDER_MESSAGES,
  CANCEL_ORDER_REASON_OPTIONS,
  CANCEL_ORDER_REASONS,
} from "../../constants/cancel-order.constants";
import { useCancelOrder } from "../../hooks/use-cancel-order";
import type { CancelOrderReasonKey } from "../../types/cancel-order.types";
import { CancellationReasonSelect } from "./CancellationReasonSelect";
import { CancellationWarningCard } from "./CancellationWarningCard";
import { CancelOrderActions } from "./CancelOrderActions";

export interface CancelOrderModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orderId: string;
  orderNumber?: string;
  onSuccess?: () => void;
}

export function CancelOrderModal({
  open,
  onOpenChange,
  orderId,
  orderNumber,
  onSuccess,
}: CancelOrderModalProps) {
  const [selectedReason, setSelectedReason] = useState<CancelOrderReasonKey | null>(null);
  const [note, setNote] = useState("");
  const keepOrderButtonRef = useRef<HTMLButtonElement>(null);

  const { mutate, isPending } = useCancelOrder(orderId, {
    onSuccess: () => {
      onOpenChange(false);
      resetState();
      onSuccess?.();
    },
    onError: (err) => {
      // 409 Conflict indicates the kitchen already started preparing
      const status = (err as { status?: number }).status;
      if (status === 409) {
        onOpenChange(false);
        resetState();
      }
    },
  });

  const resetState = () => {
    setSelectedReason(null);
    setNote("");
  };

  // Safe initial focus on "Keep My Order" whenever modal opens
  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => {
        keepOrderButtonRef.current?.focus();
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [open]);

  const handleOpenChange = (nextOpen: boolean) => {
    // Prevent dismissal if submission is currently in-flight
    if (isPending) return;
    if (!nextOpen) {
      resetState();
    }
    onOpenChange(nextOpen);
  };

  const handleConfirmCancel = () => {
    if (!selectedReason || isPending) return;

    let reasonText: string;
    if (selectedReason === CANCEL_ORDER_REASONS.OTHER) {
      reasonText = note.trim() || "Other reason";
    } else {
      const foundOption = CANCEL_ORDER_REASON_OPTIONS.find((opt) => opt.value === selectedReason);
      reasonText = foundOption?.label || selectedReason;
    }

    mutate({
      cancellation_reason: reasonText,
    });
  };

  const canConfirm = Boolean(selectedReason);

  return (
    <AlertDialogPrimitive.Root open={open} onOpenChange={handleOpenChange}>
      <AlertDialogPrimitive.Portal>
        {/* Backdrop Overlay with blur */}
        <AlertDialogPrimitive.Backdrop
          data-slot="alert-dialog-overlay"
          data-testid="cancel-order-modal-overlay"
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs transition-opacity duration-200 animate-in fade-in"
        />

        {/* Modal Content - Centered Dialog on Tablet/Desktop, Bottom Sheet on Mobile */}
        <AlertDialogPrimitive.Popup
          data-slot="alert-dialog-content"
          data-testid="cancel-order-modal"
          role="alertdialog"
          aria-modal="true"
          aria-labelledby="cancel-order-title"
          aria-describedby="cancel-order-description"
          className={cn(
            "fixed z-50 flex flex-col gap-5 bg-white text-neutral-900 shadow-2xl transition-all duration-200 outline-none",
            // Mobile: Bottom-sheet drawer
            "bottom-0 left-0 right-0 max-h-[92vh] overflow-y-auto rounded-t-3xl p-5 border-t border-neutral-200",
            // Tablet & Desktop: Centered card
            "sm:bottom-auto sm:top-1/2 sm:left-1/2 sm:right-auto sm:-translate-x-1/2 sm:-translate-y-1/2 sm:w-full sm:max-w-lg sm:rounded-3xl sm:p-6 sm:border sm:border-neutral-200",
          )}
        >
          {/* Header */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex flex-col gap-1">
              <AlertDialogPrimitive.Title
                id="cancel-order-title"
                data-testid="cancel-order-modal-title"
                className="text-lg sm:text-xl font-bold tracking-tight text-neutral-900"
              >
                {CANCEL_ORDER_MESSAGES.MODAL_TITLE}
                {orderNumber && (
                  <span className="ml-1.5 font-normal text-neutral-500">
                    {` (#${orderNumber})`}
                  </span>
                )}
              </AlertDialogPrimitive.Title>

              <AlertDialogPrimitive.Description
                id="cancel-order-description"
                data-testid="cancel-order-modal-description"
                className="text-xs sm:text-sm text-neutral-500 font-medium leading-relaxed"
              >
                {CANCEL_ORDER_MESSAGES.MODAL_DESCRIPTION}
              </AlertDialogPrimitive.Description>
            </div>

            <button
              type="button"
              onClick={() => handleOpenChange(false)}
              disabled={isPending}
              data-testid="close-modal-icon-button"
              aria-label="Close dialog"
              className="flex size-8 shrink-0 items-center justify-center rounded-full text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 transition-colors disabled:opacity-40"
            >
              <X className="size-4" />
            </button>
          </div>

          {/* Cancellation Warning Banner */}
          <CancellationWarningCard />

          {/* Reason Selection Group */}
          <CancellationReasonSelect
            selectedReason={selectedReason}
            onReasonChange={setSelectedReason}
            note={note}
            onNoteChange={setNote}
            disabled={isPending}
          />

          {/* Action Buttons */}
          <CancelOrderActions
            ref={keepOrderButtonRef}
            onKeepOrder={() => handleOpenChange(false)}
            onConfirmCancel={handleConfirmCancel}
            isPending={isPending}
            canConfirm={canConfirm}
          />
        </AlertDialogPrimitive.Popup>
      </AlertDialogPrimitive.Portal>
    </AlertDialogPrimitive.Root>
  );
}

export default CancelOrderModal;
