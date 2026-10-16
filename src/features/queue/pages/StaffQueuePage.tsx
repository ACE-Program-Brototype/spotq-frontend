import { Clock, MessageSquare, Sparkles, UserPlus, Users } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { formatTime } from "@/lib/utils";
import { WalkInRegistrationModal } from "../components/WalkInRegistrationModal";
import type { QueueEntry } from "../types/queue.types";

export default function StaffQueuePage() {
  const user = useAuthStore((state) => state.user);
  const restaurantId = user?.restaurantId || "";

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [queueEntries, setQueueEntries] = useState<QueueEntry[]>([]);

  const handleRegistrationSuccess = (newEntry: QueueEntry) => {
    setQueueEntries((prev) => [
      newEntry,
      ...prev.filter((e) => e.queueEntryId !== newEntry.queueEntryId),
    ]);
  };

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
          <p className="mt-2 text-2xl font-black text-[#9a3412]">{queueEntries.length}</p>
          <p className="mt-1 text-xs text-[#756c66]">Parties registered</p>
        </div>

        <div className="rounded-2xl border border-[#eadfd8] bg-white p-5 shadow-2xs">
          <p className="text-xs font-bold text-[#756c66] uppercase tracking-wider">
            Avg Estimated Wait
          </p>
          <p className="mt-2 text-2xl font-black text-neutral-900">
            {queueEntries.length > 0 ? "10 mins" : "0 mins"}
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
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f3e6de]">
                  {queueEntries.map((entry) => (
                    <tr
                      key={entry.queueEntryId}
                      className="hover:bg-[#faf7f5]/80 transition-colors"
                    >
                      <td className="px-4 py-3 font-bold text-neutral-900">
                        <span className="inline-flex size-6 items-center justify-center rounded-md bg-[#faf7f5] text-xs font-black text-[#9a3412] border border-[#eddcd4]">
                          #{entry.position}
                        </span>
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
                        <Badge className="bg-blue-50 text-blue-700 border-blue-200 font-bold text-[10px]">
                          {entry.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-neutral-500 text-xs">
                        <span className="inline-flex items-center gap-1">
                          <Clock className="size-3 text-neutral-400" />
                          {formatTime(entry.joinedAt)}
                        </span>
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
    </div>
  );
}
