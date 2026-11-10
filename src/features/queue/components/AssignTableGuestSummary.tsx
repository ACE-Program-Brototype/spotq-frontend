import { MessageSquare, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { QueueEntry } from "../types/queue.types";

interface AssignTableGuestSummaryProps {
  queueEntry: QueueEntry;
}

export function AssignTableGuestSummary({ queueEntry }: AssignTableGuestSummaryProps) {
  return (
    <div className="rounded-xl border border-[#eddcd4] bg-[#faf7f5]/80 p-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm text-neutral-900">{queueEntry.guestName}</span>
            <Badge className="bg-[#fed7aa] text-[#9a3412] border-[#fbd0a7] text-[10px] font-black">
              #{queueEntry.position} in line
            </Badge>
            {queueEntry.guestPhone && (
              <span className="text-xs text-neutral-500 font-mono">{queueEntry.guestPhone}</span>
            )}
          </div>
          {queueEntry.specialNotes && (
            <p className="text-xs text-neutral-600 flex items-center gap-1.5 pt-0.5">
              <MessageSquare className="size-3 text-neutral-400 shrink-0" />
              <span>{queueEntry.specialNotes}</span>
            </p>
          )}
        </div>

        <div className="flex items-center gap-4 shrink-0 text-xs">
          <div className="flex items-center gap-1.5 font-bold text-neutral-800 bg-white px-3 py-1.5 rounded-lg border border-[#eddcd4]">
            <Users className="size-3.5 text-[#9a3412]" />
            <span>
              Party of {queueEntry.partySize} {queueEntry.partySize === 1 ? "Guest" : "Guests"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
