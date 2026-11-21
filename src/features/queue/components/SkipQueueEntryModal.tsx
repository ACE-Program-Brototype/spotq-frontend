import { AlertCircle, ArrowDown, FastForward, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Spinner } from "@/components/common/LoadingIndicator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { StaffLiveQueueEntry } from "@/features/queue/types/queue.types";

interface SkipQueueEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  queueEntry: StaffLiveQueueEntry | null;
  onConfirm: (skipPositions: number, reason: string) => Promise<void>;
  isSubmitting: boolean;
}

const COMMON_SKIP_REASONS = [
  "Guest requested more time",
  "Party incomplete / waiting for members",
  "Guest temporarily stepped away",
  "Table preference request",
] as const;

export function SkipQueueEntryModal({
  isOpen,
  onClose,
  queueEntry,
  onConfirm,
  isSubmitting,
}: SkipQueueEntryModalProps) {
  const [skipPositions, setSkipPositions] = useState<number>(2);
  const [reason, setReason] = useState<string>("");
  const [validationError, setValidationError] = useState<string | null>(null);
  const dialogCardRef = useRef<HTMLDivElement>(null);
  const previousActiveElementRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      setSkipPositions(2);
      setReason("");
      setValidationError(null);
      previousActiveElementRef.current = document.activeElement as HTMLElement | null;
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      if (previousActiveElementRef.current) {
        previousActiveElementRef.current.focus?.();
        previousActiveElementRef.current = null;
      }
      return;
    }

    const card = dialogCardRef.current;
    if (card) {
      const focusable = card.querySelectorAll<HTMLElement>(
        'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (focusable.length > 0) {
        focusable[0]?.focus();
      }
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isSubmitting) {
        onClose();
        return;
      }

      if (e.key === "Tab" && card) {
        const focusableElements = Array.from(
          card.querySelectorAll<HTMLElement>(
            'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
          ),
        );
        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isSubmitting, onClose]);

  if (!isOpen || !queueEntry) {
    return null;
  }

  const handleSelectPresetReason = (preset: string) => {
    setReason(preset);
    setValidationError(null);
  };

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (!reason.trim()) {
      setValidationError("Please select or enter a reason for skipping this party.");
      return;
    }

    try {
      await onConfirm(skipPositions, reason.trim());
      onClose();
    } catch {
      // Error handled by caller / mutation hook
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="skip-party-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-150"
      data-testid="skip-queue-entry-modal"
    >
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Close modal overlay"
        onClick={onClose}
        disabled={isSubmitting}
        className="fixed inset-0 bg-neutral-900/60 backdrop-blur-xs cursor-default border-0 outline-none w-full h-full disabled:cursor-not-allowed"
      />

      <div
        ref={dialogCardRef}
        className="relative z-10 w-full max-w-md rounded-2xl bg-white border border-[#eddcd4] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150 flex flex-col"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-[#eddcd4] bg-[#faf7f5] px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="size-9 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700">
              <FastForward className="size-4.5" />
            </div>
            <div>
              <h2 id="skip-party-modal-title" className="text-base font-bold text-neutral-900">
                Skip Party in Queue
              </h2>
              <p className="text-xs text-[#756c66]">
                Move #{queueEntry.queueNumber} ({queueEntry.guestName}) down the waitlist
              </p>
            </div>
          </div>
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            disabled={isSubmitting}
            className="rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 transition-colors"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Party summary badge */}
          <div className="rounded-xl bg-[#faf7f5] border border-[#eadfd8] p-3 flex items-center justify-between text-xs">
            <div>
              <span className="font-bold text-neutral-900">{queueEntry.guestName}</span>
              <span className="text-[#756c66] ml-1.5">({queueEntry.partySize} guests)</span>
            </div>
            <div className="flex items-center gap-1 font-mono font-bold text-[#9a3412]">
              <ArrowDown className="size-3.5" />
              <span>Current Pos: #{queueEntry.position ?? 1}</span>
            </div>
          </div>

          {/* Positions to skip */}
          <div className="space-y-1.5">
            <label
              htmlFor="skip-positions-input"
              className="text-xs font-bold text-[#756c66] uppercase tracking-wider"
            >
              Positions to Move Back
            </label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 5].map((count) => (
                <button
                  key={count}
                  type="button"
                  onClick={() => setSkipPositions(count)}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                    skipPositions === count
                      ? "bg-[#9a3412] text-white border-[#9a3412] shadow-2xs"
                      : "bg-[#faf7f5] text-[#756c66] border-[#eadfd8] hover:bg-[#f3e6de]/60"
                  }`}
                >
                  +{count} {count === 1 ? "Spot" : "Spots"}
                </button>
              ))}
            </div>
          </div>

          {/* Preset Reasons */}
          <div className="space-y-1.5">
            <span className="text-xs font-bold text-[#756c66] uppercase tracking-wider block">
              Reason for Skip <span className="text-red-500">*</span>
            </span>
            <div className="grid grid-cols-1 gap-1.5">
              {COMMON_SKIP_REASONS.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => handleSelectPresetReason(preset)}
                  className={`text-left text-xs px-3 py-2 rounded-lg border transition-all ${
                    reason === preset
                      ? "border-[#9a3412] bg-[#fed7aa]/20 font-bold text-[#9a3412]"
                      : "border-[#eadfd8] bg-[#faf7f5]/40 text-neutral-700 hover:bg-[#faf7f5]"
                  }`}
                >
                  {preset}
                </button>
              ))}
            </div>

            {/* Custom Reason Input */}
            <Input
              id="skip-custom-reason"
              type="text"
              placeholder="Or type a custom reason..."
              value={reason}
              onChange={(e) => {
                setReason(e.target.value);
                setValidationError(null);
              }}
              className="mt-2 text-xs rounded-xl border-[#eadfd8]"
              data-testid="skip-reason-input"
            />
          </div>

          {validationError && (
            <div className="flex items-center gap-2 text-xs text-red-600 bg-red-50 p-2.5 rounded-xl border border-red-200">
              <AlertCircle className="size-4 shrink-0" />
              <span>{validationError}</span>
            </div>
          )}

          {/* Modal Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#eddcd4]">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
              className="rounded-xl h-10 px-4 text-xs font-bold border-[#eadfd8]"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              data-testid="confirm-skip-button"
              className="rounded-xl h-10 px-5 text-xs font-bold bg-[#9a3412] hover:bg-[#7c2d12] text-white flex items-center gap-2"
            >
              {isSubmitting ? <Spinner size="sm" /> : <FastForward className="size-4" />}
              <span>{isSubmitting ? "Skipping..." : `Skip ${skipPositions} Positions`}</span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
