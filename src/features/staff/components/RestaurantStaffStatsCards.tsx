import { Mail, UserCheck, UserX } from "lucide-react";
import type { StaffDirectoryStats } from "../services/staff-member.service";

interface RestaurantStaffStatsCardsProps {
  stats: StaffDirectoryStats;
  pendingInvites: number;
}

export function RestaurantStaffStatsCards({
  stats,
  pendingInvites,
}: RestaurantStaffStatsCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="rounded-2xl border border-[#eddcd4] bg-white p-5 shadow-2xs">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold text-neutral-500">Total Team</p>
          <div className="size-8 rounded-xl bg-neutral-100 border border-neutral-200 flex items-center justify-center text-neutral-500">
            <UserCheck className="size-4" />
          </div>
        </div>
        <p className="mt-3 text-2xl font-bold text-neutral-900">{stats.total}</p>
        <p className="mt-1 text-xs text-neutral-400">Registered employees</p>
      </div>

      <div className="rounded-2xl border border-[#eddcd4] bg-white p-5 shadow-2xs">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold text-neutral-500">Active Staff</p>
          <div className="size-8 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
            <UserCheck className="size-4" />
          </div>
        </div>
        <p className="mt-3 text-2xl font-bold text-emerald-600">{stats.active}</p>
        <p className="mt-1 text-xs text-neutral-400">Can access system &amp; queues</p>
      </div>

      <div className="rounded-2xl border border-[#eddcd4] bg-white p-5 shadow-2xs">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold text-neutral-500">Pending Invites</p>
          <div className="size-8 rounded-xl bg-[#fef3ec] border border-[#fae2d3] flex items-center justify-center text-[#e8631b]">
            <Mail className="size-4" />
          </div>
        </div>
        <p className="mt-3 text-2xl font-bold text-[#e8631b]">{pendingInvites}</p>
        <p className="mt-1 text-xs text-neutral-400">Awaiting user registration</p>
      </div>

      <div className="rounded-2xl border border-[#eddcd4] bg-white p-5 shadow-2xs">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold text-neutral-500">Inactive Staff</p>
          <div className="size-8 rounded-xl bg-neutral-100 border border-neutral-200 flex items-center justify-center text-neutral-500">
            <UserX className="size-4" />
          </div>
        </div>
        <p className="mt-3 text-2xl font-bold text-neutral-600">{stats.inactive}</p>
        <p className="mt-1 text-xs text-neutral-400">Access suspended or left</p>
      </div>
    </div>
  );
}
