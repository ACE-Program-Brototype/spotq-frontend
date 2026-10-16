import { AlertTriangle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CART_UI_MESSAGES } from "../constants/cart.constants";

export interface RestaurantMismatchDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmClearAndAdd: () => void;
  isClearing?: boolean;
}

export function RestaurantMismatchDialog({
  isOpen,
  onClose,
  onConfirmClearAndAdd,
  isClearing = false,
}: RestaurantMismatchDialogProps) {
  if (!isOpen) return null;

  return (
    <div
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="mismatch-title"
      aria-describedby="mismatch-desc"
      data-testid="restaurant-mismatch-dialog"
      className="fixed inset-0 z-60 flex items-center justify-center p-4"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
        onClick={() => {
          if (!isClearing) {
            onClose();
          }
        }}
        aria-hidden="true"
      />

      {/* Modal Dialog Content */}
      <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-xl ring-1 ring-black/5 animate-in fade-in-0 zoom-in-95 duration-150">
        <div className="flex items-start gap-4">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-600">
            <AlertTriangle className="size-6" />
          </div>

          <div className="space-y-1.5 flex-1">
            <h3 id="mismatch-title" className="text-base font-semibold text-neutral-900">
              {CART_UI_MESSAGES.MISMATCH_DIALOG_TITLE}
            </h3>
            <p id="mismatch-desc" className="text-sm text-neutral-600 leading-relaxed">
              {CART_UI_MESSAGES.MISMATCH_DIALOG_DESCRIPTION}
            </p>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-3 pt-3 border-t border-neutral-100">
          <Button
            type="button"
            variant="outline"
            disabled={isClearing}
            onClick={onClose}
            className="border-neutral-200 text-neutral-700 hover:bg-neutral-50"
            data-testid="mismatch-cancel-button"
          >
            {CART_UI_MESSAGES.MISMATCH_CANCEL}
          </Button>

          <Button
            type="button"
            disabled={isClearing}
            onClick={onConfirmClearAndAdd}
            className="bg-[#e8631b] hover:bg-[#cf5413] text-white font-medium"
            data-testid="mismatch-confirm-button"
          >
            {isClearing ? (
              <>
                <Loader2 className="size-4 animate-spin mr-1.5" />
                {CART_UI_MESSAGES.MISMATCH_CLEARING}
              </>
            ) : (
              CART_UI_MESSAGES.MISMATCH_CLEAR_AND_ADD
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default RestaurantMismatchDialog;
