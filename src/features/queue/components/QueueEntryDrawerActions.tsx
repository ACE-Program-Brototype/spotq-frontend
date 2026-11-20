import { Bell, FastForward, UserX, UtensilsCrossed } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { StaffLiveQueueEntry } from "@/features/queue/types/queue.types";

interface QueueEntryDrawerActionsProps {
  entry: StaffLiveQueueEntry;
  isOnline: boolean;
  isCalledOrRinging: boolean;
  isRinging: boolean;
  onRingCustomer: (entry: StaffLiveQueueEntry) => void;
  onAssignTable: (entry: StaffLiveQueueEntry) => void;
  onSkipParty: (entry: StaffLiveQueueEntry) => void;
  onCancelEntry: (entry: StaffLiveQueueEntry) => void;
}

export function QueueEntryDrawerActions({
  entry,
  isOnline,
  isCalledOrRinging,
  isRinging,
  onRingCustomer,
  onAssignTable,
  onSkipParty,
  onCancelEntry,
}: QueueEntryDrawerActionsProps) {
  return (
    <div className="sticky bottom-0 z-10 p-5 bg-[#faf7f5] border-t border-[#eddcd4] space-y-2.5">
      {isOnline ? (
        <div className="grid grid-cols-2 gap-2.5">
          {/* Ring Customer Button (Online guests only) */}
          <Button
            type="button"
            onClick={() => onRingCustomer(entry)}
            disabled={isRinging}
            data-testid="drawer-ring-button"
            className="rounded-xl h-10 text-xs font-bold bg-[#9a3412] hover:bg-[#7c2d12] text-white flex items-center justify-center gap-1.5 shadow-2xs"
          >
            <Bell className="size-3.5" />
            <span>
              {isRinging ? "Ringing..." : isCalledOrRinging ? "Ring Again" : "Ring Guest"}
            </span>
          </Button>

          {/* Assign Table Button */}
          <Button
            type="button"
            onClick={() => onAssignTable(entry)}
            data-testid="drawer-assign-button"
            className="rounded-xl h-10 text-xs font-bold bg-emerald-700 hover:bg-emerald-800 text-white flex items-center justify-center gap-1.5 shadow-2xs"
          >
            <UtensilsCrossed className="size-3.5" />
            <span>Assign Table</span>
          </Button>
        </div>
      ) : (
        <div>
          {/* Assign Table Button (Full width for walk-in guests) */}
          <Button
            type="button"
            onClick={() => onAssignTable(entry)}
            data-testid="drawer-assign-button"
            className="w-full rounded-xl h-10 text-xs font-bold bg-emerald-700 hover:bg-emerald-800 text-white flex items-center justify-center gap-1.5 shadow-2xs"
          >
            <UtensilsCrossed className="size-3.5" />
            <span>Assign Table</span>
          </Button>
        </div>
      )}

      <div className="grid grid-cols-2 gap-2.5">
        {/* Skip Party Button */}
        <Button
          type="button"
          variant="outline"
          onClick={() => onSkipParty(entry)}
          data-testid="drawer-skip-button"
          className="rounded-xl h-9 text-xs font-bold border-[#eadfd8] text-neutral-700 hover:bg-white flex items-center justify-center gap-1.5"
        >
          <FastForward className="size-3.5 text-amber-600" />
          <span>Skip Party</span>
        </Button>

        {/* Cancel / No-Show Button */}
        <Button
          type="button"
          variant="outline"
          onClick={() => onCancelEntry(entry)}
          data-testid="drawer-cancel-button"
          className="rounded-xl h-9 text-xs font-bold border-red-200 text-red-700 hover:bg-red-50 flex items-center justify-center gap-1.5"
        >
          <UserX className="size-3.5 text-red-600" />
          <span>No-Show / Cancel</span>
        </Button>
      </div>
    </div>
  );
}
