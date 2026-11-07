import { CheckCircle2, Clock, Mail, ShieldAlert } from "lucide-react";
import type { StaffInvitationStats } from "../types/staff-invitation.types";

export function StaffInvitationsStatsCards({ stats }: { stats: StaffInvitationStats }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="rounded-2xl border border-[#eddcd4] bg-white p-5 shadow-2xs">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold text-neutral-500">Total Sent</p>
          <div className="size-8 rounded-xl bg-neutral-100 border border-neutral-200 flex items-center justify-center text-neutral-600">
            <Mail className="size-4" />
          </div>
        </div>
        <p className="mt-3 text-2xl font-bold text-neutral-900">{stats.total}</p>
        <p className="mt-1 text-xs text-neutral-400">All dispatched invites</p>
      </div>

      <div className="rounded-2xl border border-[#eddcd4] bg-white p-5 shadow-2xs">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold text-neutral-500">Pending</p>
          <div className="size-8 rounded-xl bg-[#fef3ec] border border-[#fae2d3] flex items-center justify-center text-[#e8631b]">
            <Clock className="size-4" />
          </div>
        </div>
        <p className="mt-3 text-2xl font-bold text-[#e8631b]">{stats.pending}</p>
        <p className="mt-1 text-xs text-neutral-400">Awaiting registration</p>
      </div>

      <div className="rounded-2xl border border-[#eddcd4] bg-white p-5 shadow-2xs">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold text-neutral-500">Accepted</p>
          <div className="size-8 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
            <CheckCircle2 className="size-4" />
          </div>
        </div>
        <p className="mt-3 text-2xl font-bold text-emerald-600">{stats.accepted}</p>
        <p className="mt-1 text-xs text-neutral-400">Successfully joined</p>
      </div>

      <div className="rounded-2xl border border-[#eddcd4] bg-white p-5 shadow-2xs">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold text-neutral-500">Expired / Revoked</p>
          <div className="size-8 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600">
            <ShieldAlert className="size-4" />
          </div>
        </div>
        <p className="mt-3 text-2xl font-bold text-rose-600">
          {stats.expired + (stats.revoked || 0)}
        </p>
        <p className="mt-1 text-xs text-neutral-400">Invalidated links</p>
      </div>
    </div>
  );
}
