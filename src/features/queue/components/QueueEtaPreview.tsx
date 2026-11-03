import { Clock, Info, Users } from "lucide-react";
import { QUEUE_MESSAGES } from "../constants/queue.constants";

export interface QueueEtaPreviewProps {
  isLoading: boolean;
  isError: boolean;
  estimatedWaitMinutes?: number | null;
  partiesAhead?: number | null;
  partySize: number;
}

export function QueueEtaPreview({
  isLoading,
  isError,
  estimatedWaitMinutes,
  partiesAhead,
  partySize,
}: QueueEtaPreviewProps) {
  if (isLoading) {
    return (
      <div
        data-testid="eta-loading"
        className="flex items-center gap-2.5 rounded-xl border border-orange-200/80 bg-orange-50/70 p-3 text-xs text-orange-900 animate-pulse"
      >
        <Clock className="size-4 animate-spin text-orange-600 shrink-0" />
        <span className="font-medium">{QUEUE_MESSAGES.ETA_CALCULATING}</span>
      </div>
    );
  }

  if (isError || typeof estimatedWaitMinutes !== "number") {
    return (
      <div
        data-testid="eta-fallback"
        className="flex items-center gap-2.5 rounded-xl border border-neutral-200 bg-neutral-50/90 p-3 text-xs text-neutral-600"
      >
        <Info className="size-4 text-neutral-400 shrink-0" />
        <span>{QUEUE_MESSAGES.ETA_UNAVAILABLE}</span>
      </div>
    );
  }

  return (
    <div
      data-testid="eta-success"
      className="rounded-2xl border border-orange-200 bg-linear-to-r from-orange-50/90 to-amber-50/80 p-3.5 space-y-2 shadow-2xs"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex size-7 items-center justify-center rounded-lg bg-orange-600 text-white shadow-xs">
            <Clock className="size-4" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-orange-700">
              Live Wait Estimate
            </span>
            <p className="text-base font-black text-neutral-900 leading-tight">
              ~{estimatedWaitMinutes} {estimatedWaitMinutes === 1 ? "minute" : "minutes"}
            </p>
          </div>
        </div>

        {typeof partiesAhead === "number" && (
          <span className="inline-flex items-center gap-1 rounded-full bg-white px-2.5 py-1 text-xs font-bold text-neutral-700 border border-orange-200 shadow-2xs">
            <Users className="size-3 text-orange-600" />
            {partiesAhead} {partiesAhead === 1 ? "party" : "parties"} ahead
          </span>
        )}
      </div>

      <p className="text-[11px] text-neutral-500 leading-relaxed">
        Estimated for party of {partySize}. Wait times vary based on table turn rate and party size.
      </p>
    </div>
  );
}
