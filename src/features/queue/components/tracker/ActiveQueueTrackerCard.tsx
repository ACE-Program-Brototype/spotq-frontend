import { LogOut, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CircularPositionBadge } from "@/features/queue/components/tracker/CircularPositionBadge";
import { EstimatedWaitChip } from "@/features/queue/components/tracker/EstimatedWaitChip";
import { QueueProgressBar } from "@/features/queue/components/tracker/QueueProgressBar";

interface ActiveQueueTrackerCardProps {
  queueNumber: string;
  partySize: number;
  effectiveAssignedTable?: string | null;
  effectivePosition: number | null;
  effectivePeopleAhead: number | null;
  effectiveInitialPosition: number | null;
  effectiveWaitMinutes?: number | null;
  canCancel?: boolean;
  isLeaving: boolean;
  onLeaveClick: () => void;
}

export function ActiveQueueTrackerCard({
  queueNumber,
  partySize,
  effectiveAssignedTable,
  effectivePosition,
  effectivePeopleAhead,
  effectiveInitialPosition,
  effectiveWaitMinutes,
  canCancel = true,
  isLeaving,
  onLeaveClick,
}: ActiveQueueTrackerCardProps) {
  return (
    <Card className="relative overflow-hidden rounded-2xl border border-[#eddcd4] bg-white p-3.5 sm:p-5 shadow-xs">
      <div className="flex items-center justify-between border-b border-[#eddcd4]/60 pb-2.5 sm:pb-3">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">
            Queue Number
          </span>
          <div className="text-xl sm:text-2xl font-black text-neutral-900 tracking-tight leading-none mt-0.5">
            {queueNumber}
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          {effectiveAssignedTable && (
            <div className="flex items-center gap-1 rounded-lg bg-emerald-50 px-2 py-1 text-[11px] font-semibold text-emerald-800 border border-emerald-200/60">
              <span>Table: {effectiveAssignedTable}</span>
            </div>
          )}
          <div className="flex items-center gap-1 rounded-lg bg-[#fcf5f0] px-2 py-1 text-[11px] font-semibold text-[#9a3412] border border-[#eddcd4]">
            <Users className="size-3 text-[#e8631b]" />
            <span>
              {partySize} {partySize === 1 ? "Guest" : "Guests"}
            </span>
          </div>
        </div>
      </div>

      <div className="py-2.5 sm:py-3.5">
        <CircularPositionBadge
          position={effectivePosition}
          peopleAhead={effectivePeopleAhead}
        />
      </div>

      <div className="pt-2 pb-2.5 border-t border-[#eddcd4]/50">
        <QueueProgressBar
          currentPosition={effectivePosition}
          initialPosition={effectiveInitialPosition}
        />
      </div>

      <div className="flex items-center justify-between gap-2 pt-1">
        <EstimatedWaitChip estimatedWaitMinutes={effectiveWaitMinutes ?? null} />
        <span className="text-[10px] text-neutral-400">Auto-updates live</span>
      </div>

      {canCancel && (
        <div className="pt-2.5 mt-2.5 border-t border-dashed border-[#eddcd4] flex items-center justify-between gap-2">
          <span className="text-[11px] text-neutral-500">Need to cancel?</span>
          <Button
            variant="outline"
            size="sm"
            onClick={onLeaveClick}
            disabled={isLeaving}
            className="border-[#eddcd4] text-neutral-600 hover:text-red-600 hover:bg-red-50 hover:border-red-200 text-xs font-semibold h-7.5 px-2.5 rounded-xl transition-all cursor-pointer"
          >
            <LogOut className="mr-1 size-3" />
            Leave Queue
          </Button>
        </div>
      )}
    </Card>
  );
}
