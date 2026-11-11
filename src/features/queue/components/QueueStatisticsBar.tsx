import { Bell, Clock, UserCheck, Users } from "lucide-react";
import type { StaffQueueStatistics } from "@/features/queue/types/queue.types";

interface QueueStatisticsBarProps {
  statistics: StaffQueueStatistics;
}

export function QueueStatisticsBar({ statistics }: QueueStatisticsBarProps) {
  return (
    <div
      data-testid="queue-statistics-bar"
      className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4"
    >
      {/* Waiting Parties */}
      <div className="rounded-2xl border border-[#eadfd8] bg-white p-4 sm:p-5 shadow-2xs transition-all hover:shadow-xs">
        <div className="flex items-center justify-between">
          <p className="text-xs font-bold text-[#756c66] uppercase tracking-wider">
            Waiting Parties
          </p>
          <div className="size-8 rounded-xl bg-[#fed7aa]/30 flex items-center justify-center text-[#9a3412]">
            <Users className="size-4" />
          </div>
        </div>
        <p
          data-testid="stat-waiting-parties"
          className="mt-2 text-2xl sm:text-3xl font-black text-[#9a3412]"
        >
          {statistics.waitingParties}
        </p>
        <p className="mt-1 text-xs text-[#756c66]">Parties waiting in line</p>
      </div>

      {/* Waiting People */}
      <div className="rounded-2xl border border-[#eadfd8] bg-white p-4 sm:p-5 shadow-2xs transition-all hover:shadow-xs">
        <div className="flex items-center justify-between">
          <p className="text-xs font-bold text-[#756c66] uppercase tracking-wider">
            Waiting Guests
          </p>
          <div className="size-8 rounded-xl bg-blue-50 flex items-center justify-center text-blue-700">
            <UserCheck className="size-4" />
          </div>
        </div>
        <p
          data-testid="stat-waiting-people"
          className="mt-2 text-2xl sm:text-3xl font-black text-neutral-900"
        >
          {statistics.waitingPeople}
        </p>
        <p className="mt-1 text-xs text-[#756c66]">Total people in queue</p>
      </div>

      {/* Ringing Parties */}
      <div className="rounded-2xl border border-[#eadfd8] bg-white p-4 sm:p-5 shadow-2xs transition-all hover:shadow-xs">
        <div className="flex items-center justify-between">
          <p className="text-xs font-bold text-[#756c66] uppercase tracking-wider">
            Ringing Parties
          </p>
          <div className="size-8 rounded-xl bg-amber-50 flex items-center justify-center text-amber-700">
            <Bell className="size-4" />
          </div>
        </div>
        <p
          data-testid="stat-ringing-parties"
          className="mt-2 text-2xl sm:text-3xl font-black text-amber-800"
        >
          {statistics.ringingParties}
        </p>
        <p className="mt-1 text-xs text-[#756c66]">Called & response pending</p>
      </div>

      {/* People Ringing */}
      <div className="rounded-2xl border border-[#eadfd8] bg-white p-4 sm:p-5 shadow-2xs transition-all hover:shadow-xs">
        <div className="flex items-center justify-between">
          <p className="text-xs font-bold text-[#756c66] uppercase tracking-wider">
            People Ringing
          </p>
          <div className="size-8 rounded-xl bg-purple-50 flex items-center justify-center text-purple-700">
            <Clock className="size-4" />
          </div>
        </div>
        <p
          data-testid="stat-ringing-people"
          className="mt-2 text-2xl sm:text-3xl font-black text-purple-900"
        >
          {statistics.ringingPeople}
        </p>
        <p className="mt-1 text-xs text-[#756c66]">Guests notified for seating</p>
      </div>
    </div>
  );
}
