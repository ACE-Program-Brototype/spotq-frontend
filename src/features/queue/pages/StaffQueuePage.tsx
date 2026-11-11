import { Clock, MessageSquare, Sparkles, UserPlus, Users, UtensilsCrossed } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { formatTime } from "@/lib/utils";
import { AssignTableModal } from "../components/AssignTableModal";
import { WalkInRegistrationModal } from "../components/WalkInRegistrationModal";
import { QUEUE_STATUS } from "../constants/queue.constants";
import type { QueueEntry } from "../types/queue.types";

export default function StaffQueuePage() {
  const user = useAuthStore((state) => state.user);
  const restaurantId = user?.restaurantId || "";

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEntryForAssign, setSelectedEntryForAssign] = useState<QueueEntry | null>(null);
  const [queueEntries, setQueueEntries] = useState<QueueEntry[]>([]);

  const handleRegistrationSuccess = (newEntry: QueueEntry) => {
    setQueueEntries((prev) => [
      newEntry,
      ...prev.filter((e) => e.queueEntryId !== newEntry.queueEntryId),
    ]);
  };

  const handleAssignSuccess = (updatedEntry: QueueEntry) => {
    setQueueEntries((prev) =>
      prev.map((e) => (e.queueEntryId === updatedEntry.queueEntryId ? updatedEntry : e)),
    );
  };

  const waitingEntriesCount = queueEntries.filter((e) => e.status === QUEUE_STATUS.WAITING).length;

  return (
    <div className="space-y-6 max-w-full">
      {/* Top Header Card */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-[#eadfd8] bg-white p-6 shadow-xs">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-[#1c1714]">
              Queue Management
            </h1>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-700 border border-emerald-200">
              <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live Host Terminal
            </span>
          </div>
          <p className="mt-1 text-xs sm:text-sm text-[#756c66]">
            Register walk-in guests and monitor live restaurant queue entries.
          </p>
        </div>

        <div>
          <Button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="h-11 px-5 rounded-xl bg-[#9a3412] hover:bg-[#7c2d12] text-white font-bold shadow-sm transition-all flex items-center gap-2"
          >
            <UserPlus className="size-4.5" />
            <span>Add to Queue</span>
          </Button>
        </div>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-[#eadfd8] bg-white p-5 shadow-2xs">
          <p className="text-xs font-bold text-[#756c66] uppercase tracking-wider">
            Waiting in Queue
          </p>
          <p className="mt-2 text-2xl font-black text-[#9a3412]">{waitingEntriesCount}</p>
          <p className="mt-1 text-xs text-[#756c66]">Parties waiting</p>
        </div>

        <div className="rounded-2xl border border-[#eadfd8] bg-white p-5 shadow-2xs">
          <p className="text-xs font-bold text-[#756c66] uppercase tracking-wider">
            Avg Estimated Wait
          </p>
          <p className="mt-2 text-2xl font-black text-neutral-900">
            {waitingEntriesCount > 0 ? "10 mins" : "0 mins"}
          </p>
          <p className="mt-1 text-xs text-[#756c66]">Based on party volume</p>
        </div>

        <div className="rounded-2xl border border-[#eadfd8] bg-white p-5 shadow-2xs">
          <p className="text-xs font-bold text-[#756c66] uppercase tracking-wider">
            Terminal Status
          </p>
          <p className="mt-2 text-2xl font-black text-emerald-700">Ready</p>
          <p className="mt-1 text-xs text-[#756c66]">Connected to queue-service</p>
        </div>
      </div>

      {/* Queue List Table / Empty State */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-neutral-900 flex items-center gap-2">
            <Users className="size-4 text-[#9a3412]" />
            Waitlist Entries ({queueEntries.length})
          </h2>
        </div>

        {queueEntries.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center rounded-2xl border border-dashed border-[#eddcd4] bg-[#faf7f5]/60">
            <div className="size-14 rounded-2xl bg-[#fed7aa]/40 flex items-center justify-center text-[#9a3412] mb-3 border border-[#fbd0a7]">
              <Users className="size-7 text-[#9a3412]" />
            </div>
            <h3 className="text-base font-bold text-neutral-900">No Guests in Waitlist</h3>
            <p className="text-xs text-[#756c66] mt-1 max-w-sm">
              There are currently no walk-in guests waiting. Click the button below to register an
              arriving party.
            </p>
            <Button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="mt-4 h-9 px-4 rounded-xl bg-[#9a3412] hover:bg-[#7c2d12] text-white font-bold text-xs flex items-center gap-2"
            >
              <Sparkles className="size-3.5" />
              <span>Add to Queue</span>
            </Button>
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-[#eddcd4] bg-white shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-neutral-600">
                <thead className="border-b border-[#eddcd4] bg-[#faf7f5] text-[11px] font-bold uppercase tracking-wider text-[#756c66]">
                  <tr>
                    <th scope="col" className="px-4 py-3">
                      Pos
                    </th>
                    <th scope="col" className="px-4 py-3">
                      Guest
                    </th>
                    <th scope="col" className="px-4 py-3">
                      Party Size
                    </th>
                    <th scope="col" className="px-4 py-3">
                      Special Notes
                    </th>
                    <th scope="col" className="px-4 py-3">
                      Status
                    </th>
                    <th scope="col" className="px-4 py-3">
                      Joined At
                    </th>
                    <th scope="col" className="px-4 py-3 text-right">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f3e6de]">
                  {queueEntries.map((entry) => (
                    <tr
                      key={entry.queueEntryId}
                      className="hover:bg-[#faf7f5]/80 transition-colors"
                    >
                      <td className="px-4 py-3 font-bold text-neutral-900">
                        {entry.status === QUEUE_STATUS.SEATED ? (
                          <span className="inline-flex size-6 items-center justify-center rounded-md bg-emerald-50 text-xs font-black text-emerald-700 border border-emerald-200">
                            ✓
                          </span>
                        ) : (
                          <span className="inline-flex size-6 items-center justify-center rounded-md bg-[#faf7f5] text-xs font-black text-[#9a3412] border border-[#eddcd4]">
                            #{entry.position}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-bold text-neutral-900">{entry.guestName}</div>
                        {entry.guestPhone && (
                          <div className="text-[11px] text-neutral-500 font-mono mt-0.5">
                            {entry.guestPhone}
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3 font-semibold text-neutral-800">
                        {entry.partySize} {entry.partySize === 1 ? "Guest" : "Guests"}
                      </td>
                      <td className="px-4 py-3 max-w-xs text-neutral-700">
                        {entry.specialNotes ? (
                          <div className="flex items-center gap-1.5">
                            <MessageSquare className="size-3.5 text-neutral-400 shrink-0" />
                            <span className="truncate">{entry.specialNotes}</span>
                          </div>
                        ) : (
                          <span className="text-neutral-400 italic">None</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <Badge
                          className={`text-[10px] font-bold ${
                            entry.status === QUEUE_STATUS.SEATED
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : entry.status === QUEUE_STATUS.CALLED
                                ? "bg-amber-50 text-amber-700 border-amber-200"
                                : "bg-blue-50 text-blue-700 border-blue-200"
                          }`}
                        >
                          {entry.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-neutral-500 text-xs">
                        <span className="inline-flex items-center gap-1">
                          <Clock className="size-3 text-neutral-400" />
                          {formatTime(entry.joinedAt)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        {entry.status === QUEUE_STATUS.WAITING ? (
                          <Button
                            type="button"
                            size="sm"
                            onClick={() => setSelectedEntryForAssign(entry)}
                            className="h-8 px-3 rounded-xl bg-[#9a3412] hover:bg-[#7c2d12] text-white font-bold text-xs flex items-center gap-1.5 ml-auto shadow-2xs transition-all"
                          >
                            <UtensilsCrossed className="size-3.5" />
                            <span>Assign Table</span>
                          </Button>
                        ) : entry.status === QUEUE_STATUS.SEATED ? (
                          <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                            Seated
                          </span>
                        ) : (
                          <span className="text-xs font-semibold text-neutral-400 italic">
                            {entry.status}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Walk-In Registration Modal */}
      <WalkInRegistrationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        restaurantId={restaurantId}
        onSuccess={handleRegistrationSuccess}
      />

      {/* Assign Table Modal */}
      {selectedEntryForAssign && (
        <AssignTableModal
          isOpen={Boolean(selectedEntryForAssign)}
          onClose={() => setSelectedEntryForAssign(null)}
          restaurantId={restaurantId}
          queueEntry={selectedEntryForAssign}
          onSuccess={handleAssignSuccess}
        />
      )}
    </div>
  );
}
