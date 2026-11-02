import { BellRing, Check, MapPin, Sparkles, Utensils } from "lucide-react";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { RING_ALERT_MESSAGES } from "../constants/ring-alert.constants";
import { ringMedia } from "../utils/ring-sound.utils";

export interface CustomerRingAlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  message?: string;
  ringCount?: number;
  assignedTableIds?: string[];
  queueNumber?: string;
}

export function CustomerRingAlertModal({
  isOpen,
  onClose,
  message = RING_ALERT_MESSAGES.DEFAULT_MESSAGE,
  ringCount = 1,
  assignedTableIds = [],
  queueNumber,
}: CustomerRingAlertModalProps) {
  // Handle Escape key to dismiss
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        ringMedia.stopAll();
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  const handleConfirm = () => {
    ringMedia.stopAll();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="ring-alert-title"
      aria-describedby="ring-alert-description"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
    >
      {/* Dimmed backdrop */}
      <button
        type="button"
        aria-label={RING_ALERT_MESSAGES.DISMISS_BACKDROP_LABEL}
        className="fixed inset-0 bg-neutral-950/75 backdrop-blur-sm transition-opacity animate-in fade-in duration-200 cursor-default"
        onClick={handleConfirm}
      />

      {/* Main Alert Card */}
      <div className="relative z-10 w-full max-w-sm rounded-3xl bg-white p-6 sm:p-7 shadow-2xl text-center space-y-6 border border-neutral-100 animate-in zoom-in-95 duration-200">
        {/* Animated Radiant Bell Icon */}
        <div className="relative mx-auto flex size-20 items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-orange-400/20 animate-ping" />
          <div className="relative flex size-20 items-center justify-center rounded-full bg-gradient-to-tr from-[#ea580c] to-[#f97316] text-white shadow-lg shadow-orange-500/30">
            <BellRing className="size-9 animate-bounce" />
          </div>
        </div>

        {/* Header and Details */}
        <div className="space-y-2">
          {queueNumber && (
            <span className="inline-flex items-center gap-1 text-xs font-black tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-orange-50 text-orange-700 border border-orange-200">
              <Sparkles className="size-3" /> {RING_ALERT_MESSAGES.TICKET_PREFIX} {queueNumber}
            </span>
          )}

          <h2 id="ring-alert-title" className="text-2xl font-black text-neutral-900 tracking-tight">
            {RING_ALERT_MESSAGES.TITLE}
          </h2>

          <p
            id="ring-alert-description"
            className="text-sm text-neutral-600 leading-relaxed max-w-xs mx-auto"
          >
            {message}
          </p>

          {ringCount > 1 && (
            <div className="pt-1">
              <span className="inline-block text-[11px] font-bold px-2.5 py-0.5 bg-amber-100 text-amber-900 rounded-full">
                {RING_ALERT_MESSAGES.CALL_BADGE(ringCount)}
              </span>
            </div>
          )}
        </div>

        {/* Assigned Tables Display if available */}
        {assignedTableIds && assignedTableIds.length > 0 && (
          <div className="rounded-2xl border border-neutral-200 bg-neutral-50/80 p-3.5 space-y-1.5">
            <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-neutral-500 uppercase tracking-wider">
              <Utensils className="size-3.5 text-orange-600" />
              <span>
                {assignedTableIds.length > 1
                  ? RING_ALERT_MESSAGES.ASSIGNED_TABLE_PLURAL
                  : RING_ALERT_MESSAGES.ASSIGNED_TABLE_SINGULAR}
              </span>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-1.5 pt-1">
              {assignedTableIds.map((tableId) => (
                <span
                  key={tableId}
                  className="inline-flex items-center px-3 py-1 rounded-xl bg-white border border-neutral-200 text-sm font-extrabold text-neutral-900 shadow-2xs"
                >
                  {tableId}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Location Notice */}
        <div className="flex items-center justify-center gap-2 text-xs font-semibold text-neutral-600 bg-orange-50/70 rounded-xl p-3 border border-orange-100">
          <MapPin className="size-4 text-orange-600 shrink-0" />
          <span>{RING_ALERT_MESSAGES.LOCATION_NOTICE}</span>
        </div>

        {/* Primary Action Button */}
        <div>
          <Button
            type="button"
            onClick={handleConfirm}
            className="w-full h-12 rounded-xl bg-[#ea580c] hover:bg-[#c2410c] active:scale-[0.99] text-white font-bold text-sm shadow-md shadow-orange-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Check className="size-5" />
            <span>{RING_ALERT_MESSAGES.ACTION_BUTTON}</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
