import { AlertTriangle, Loader2, ShieldAlert, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { RESTAURANT_MESSAGES } from "../../constants/restaurant.constants";

export interface BlockRestaurantModalProps {
  isOpen: boolean;
  onClose: () => void;
  restaurantName: string;
  isLoading?: boolean;
  onConfirm: (reason: string) => Promise<void> | void;
}

const MIN_REASON_LENGTH = 5;
const MAX_REASON_LENGTH = 500;

export function BlockRestaurantModal({
  isOpen,
  onClose,
  restaurantName,
  isLoading = false,
  onConfirm,
}: BlockRestaurantModalProps) {
  const [reason, setReason] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Reset form state on open/close
  useEffect(() => {
    if (isOpen) {
      setReason("");
      setError(null);
    }
  }, [isOpen]);

  // Handle ESC key press
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !isLoading) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, isLoading, onClose]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = reason.trim();

    if (!trimmed) {
      setError(RESTAURANT_MESSAGES.BLOCK_REASON_REQUIRED);
      return;
    }

    if (trimmed.length < MIN_REASON_LENGTH) {
      setError(RESTAURANT_MESSAGES.BLOCK_REASON_MIN_LENGTH);
      return;
    }

    setError(null);
    onConfirm(trimmed);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="block-modal-title"
      data-testid="block-restaurant-modal"
    >
      <div className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          disabled={isLoading}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors disabled:opacity-50 cursor-pointer"
          aria-label="Close dialog"
        >
          <X className="size-4" />
        </button>

        {/* Modal Header */}
        <div className="flex items-start gap-3.5 mb-5">
          <div className="size-11 shrink-0 flex items-center justify-center rounded-xl bg-rose-100 text-rose-600 border border-rose-200/80 shadow-2xs">
            <ShieldAlert className="size-6" />
          </div>
          <div className="min-w-0 pr-6">
            <h2 id="block-modal-title" className="text-lg font-bold text-slate-900">
              {RESTAURANT_MESSAGES.BLOCK_MODAL_TITLE}
            </h2>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Are you sure you want to block{" "}
              <strong className="text-slate-800">{restaurantName}</strong>?{" "}
              {RESTAURANT_MESSAGES.BLOCK_MODAL_DESCRIPTION}
            </p>
          </div>
        </div>

        {/* Warning Banner */}
        <div className="mb-4 rounded-xl bg-amber-50/80 border border-amber-200/70 p-3 flex items-start gap-2.5 text-xs text-amber-800">
          <AlertTriangle className="size-4 text-amber-600 shrink-0 mt-0.5" />
          <p className="leading-snug">
            This administrative action will immediately change the restaurant's operational status
            to <strong className="font-semibold text-amber-900">SUSPENDED (BLOCKED)</strong>.
          </p>
        </div>

        {/* Block Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label
                htmlFor="block-reason"
                className="text-xs font-bold text-slate-700 uppercase tracking-wider"
              >
                {RESTAURANT_MESSAGES.BLOCK_REASON_LABEL} <span className="text-rose-500">*</span>
              </label>
              <span className="text-[11px] font-mono text-slate-400">
                {reason.length}/{MAX_REASON_LENGTH}
              </span>
            </div>

            <textarea
              id="block-reason"
              rows={4}
              maxLength={MAX_REASON_LENGTH}
              value={reason}
              onChange={(e) => {
                setReason(e.target.value);
                if (error) setError(null);
              }}
              placeholder={RESTAURANT_MESSAGES.BLOCK_REASON_PLACEHOLDER}
              disabled={isLoading}
              className={`w-full rounded-xl border p-3 text-xs sm:text-sm transition-all focus:outline-none focus:ring-2 resize-none ${
                error
                  ? "border-rose-300 bg-rose-50/30 text-slate-900 focus:ring-rose-500 focus:border-rose-500"
                  : "border-slate-200 bg-slate-50/50 text-slate-900 focus:ring-rose-500 focus:border-rose-500 focus:bg-white"
              }`}
              data-testid="block-reason-input"
            />

            {error && (
              <p
                className="mt-1.5 text-xs font-semibold text-rose-600 flex items-center gap-1"
                data-testid="block-reason-error"
              >
                <AlertTriangle className="size-3.5 shrink-0" />
                {error}
              </p>
            )}
          </div>

          {/* Modal Footer */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              disabled={isLoading}
              className="text-xs font-semibold px-4 h-9"
              data-testid="block-cancel-btn"
            >
              {RESTAURANT_MESSAGES.BLOCK_CANCEL_BUTTON}
            </Button>
            <Button
              type="submit"
              variant="destructive"
              size="sm"
              disabled={isLoading || !reason.trim()}
              className="text-xs font-semibold px-4 h-9 gap-1.5 shadow-xs"
              data-testid="block-confirm-btn"
            >
              {isLoading ? (
                <>
                  <Loader2 className="size-3.5 animate-spin" />
                  <span>Blocking...</span>
                </>
              ) : (
                <span>{RESTAURANT_MESSAGES.BLOCK_CONFIRM_BUTTON}</span>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
