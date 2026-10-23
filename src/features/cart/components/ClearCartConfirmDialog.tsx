import { AlertTriangle, Loader2 } from "lucide-react";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { CART_UI_MESSAGES } from "../constants/cart.constants";

export interface ClearCartConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
}

export function ClearCartConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  isLoading = false,
}: ClearCartConfirmDialogProps) {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isLoading) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, isLoading, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="clear-cart-title"
      aria-describedby="clear-cart-desc"
      data-testid="clear-cart-confirm-dialog"
      className="fixed inset-0 z-60 flex items-center justify-center p-4"
    >
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
        onClick={() => {
          if (!isLoading) {
            onClose();
          }
        }}
        aria-hidden="true"
        data-testid="clear-cart-backdrop"
      />

      <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-xl ring-1 ring-black/5 animate-in fade-in-0 zoom-in-95 duration-150">
        <div className="flex items-start gap-4">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600">
            <AlertTriangle className="size-6" />
          </div>

          <div className="space-y-1.5 flex-1">
            <h3 id="clear-cart-title" className="text-base font-semibold text-neutral-900">
              {CART_UI_MESSAGES.CLEAR_CART_DIALOG_TITLE}
            </h3>
            <p id="clear-cart-desc" className="text-sm text-neutral-600 leading-relaxed">
              {CART_UI_MESSAGES.CLEAR_CART_DIALOG_DESCRIPTION}
            </p>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-3 pt-3 border-t border-neutral-100">
          <Button
            type="button"
            variant="outline"
            disabled={isLoading}
            onClick={onClose}
            className="border-neutral-200 text-neutral-700 hover:bg-neutral-50"
            data-testid="clear-cart-cancel-button"
          >
            {CART_UI_MESSAGES.CLEAR_CART_CANCEL_ACTION}
          </Button>

          <Button
            type="button"
            disabled={isLoading}
            onClick={onConfirm}
            className="bg-red-600 hover:bg-red-700 text-white font-medium"
            data-testid="clear-cart-confirm-button"
          >
            {isLoading ? (
              <>
                <Loader2 className="size-4 animate-spin mr-1.5" />
                {CART_UI_MESSAGES.CLEAR_CART_CONFIRM_ACTION}
              </>
            ) : (
              CART_UI_MESSAGES.CLEAR_CART_CONFIRM_ACTION
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ClearCartConfirmDialog;
