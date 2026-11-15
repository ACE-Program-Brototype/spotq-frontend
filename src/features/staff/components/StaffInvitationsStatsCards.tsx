import { CheckCircle2, Clock, Mail, ShieldAlert } from "lucide-react";
import type { StaffInvitationStats } from "../types/staff-invitation.types";

export function StaffInvitationsStatsCards({ stats }: { stats: StaffInvitationStats }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {/* Total Sent */}
      <div className="rounded-2xl border border-[#eddcd4] bg-white p-3.5 sm:p-4 md:p-5 shadow-2xs min-w-0 w-full min-h-[120px] flex flex-col justify-between overflow-hidden">
        <div className="flex items-start justify-between gap-1.5 sm:gap-2 min-w-0">
          <p className="text-xs font-semibold text-neutral-500 break-words [overflow-wrap:anywhere] leading-snug min-w-0">
            Total Sent
          </p>
          <div className="size-7 sm:size-8 rounded-xl bg-neutral-100 border border-neutral-200 flex items-center justify-center text-neutral-600 shrink-0">
            <Mail className="size-3.5 sm:size-4" />
          </div>
        </div>
        <div className="mt-2 sm:mt-3 min-w-0">
          <p className="text-xl sm:text-2xl font-bold text-neutral-900 leading-tight truncate">
            {stats.total}
          </p>
          <p className="mt-1 text-[11px] sm:text-xs text-neutral-400 leading-tight truncate sm:whitespace-normal">
            All dispatched invites
          </p>
        </div>
      </div>

      {/* Pending */}
      <div className="rounded-2xl border border-[#eddcd4] bg-white p-3.5 sm:p-4 md:p-5 shadow-2xs min-w-0 w-full min-h-[120px] flex flex-col justify-between overflow-hidden">
        <div className="flex items-start justify-between gap-1.5 sm:gap-2 min-w-0">
          <p className="text-xs font-semibold text-neutral-500 break-words [overflow-wrap:anywhere] leading-snug min-w-0">
            Pending
          </p>
          <div className="size-7 sm:size-8 rounded-xl bg-[#fef3ec] border border-[#fae2d3] flex items-center justify-center text-[#e8631b] shrink-0">
            <Clock className="size-3.5 sm:size-4" />
          </div>
        </div>
        <div className="mt-2 sm:mt-3 min-w-0">
          <p className="text-xl sm:text-2xl font-bold text-[#e8631b] leading-tight truncate">
            {stats.pending}
          </p>
          <p className="mt-1 text-[11px] sm:text-xs text-neutral-400 leading-tight truncate sm:whitespace-normal">
            Awaiting registration
          </p>
        </div>
      </div>

      {/* Accepted */}
      <div className="rounded-2xl border border-[#eddcd4] bg-white p-3.5 sm:p-4 md:p-5 shadow-2xs min-w-0 w-full min-h-[120px] flex flex-col justify-between overflow-hidden">
        <div className="flex items-start justify-between gap-1.5 sm:gap-2 min-w-0">
          <p className="text-xs font-semibold text-neutral-500 break-words [overflow-wrap:anywhere] leading-snug min-w-0">
            Accepted
          </p>
          <div className="size-7 sm:size-8 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shrink-0">
            <CheckCircle2 className="size-3.5 sm:size-4" />
          </div>
        </div>
        <div className="mt-2 sm:mt-3 min-w-0">
          <p className="text-xl sm:text-2xl font-bold text-emerald-600 leading-tight truncate">
            {stats.accepted}
          </p>
          <p className="mt-1 text-[11px] sm:text-xs text-neutral-400 leading-tight truncate sm:whitespace-normal">
            Successfully joined
          </p>
        </div>
      </div>

      {/* Expired / Revoked */}
      <div className="rounded-2xl border border-[#eddcd4] bg-white p-3.5 sm:p-4 md:p-5 shadow-2xs min-w-0 w-full min-h-[120px] flex flex-col justify-between overflow-hidden">
        <div className="flex items-start justify-between gap-1.5 sm:gap-2 min-w-0">
          <p className="text-xs font-semibold text-neutral-500 break-words [overflow-wrap:anywhere] leading-snug min-w-0">
            Expired / Revoked
          </p>
          <div className="size-7 sm:size-8 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 shrink-0">
            <ShieldAlert className="size-3.5 sm:size-4" />
          </div>
        </div>
        <div className="mt-2 sm:mt-3 min-w-0">
          <p className="text-xl sm:text-2xl font-bold text-rose-600 leading-tight truncate">
            {stats.expired + (stats.revoked || 0)}
          </p>
          <p className="mt-1 text-[11px] sm:text-xs text-neutral-400 leading-tight truncate sm:whitespace-normal">
            Invalidated links
          </p>
        </div>
      </div>
    </div>
  );
}
