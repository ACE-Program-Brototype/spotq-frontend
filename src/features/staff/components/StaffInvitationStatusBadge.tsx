import { CheckCircle2, Clock, ShieldAlert } from "lucide-react";
import type { StaffInvitation } from "../types/staff-invitation.types";

export function StaffInvitationStatusBadge({ invitation }: { invitation: StaffInvitation }) {
  const isExpired =
    invitation.status === "EXPIRED" ||
    (invitation.status === "PENDING" && new Date(invitation.expiresAt) < new Date());

  if (invitation.status === "ACCEPTED") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 border border-emerald-200">
        <CheckCircle2 className="size-3.5" />
        Accepted
      </span>
    );
  }
  if (invitation.status === "REVOKED") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 px-2.5 py-1 text-xs font-semibold text-rose-700 border border-rose-200">
        <ShieldAlert className="size-3.5" />
        Revoked
      </span>
    );
  }
  if (isExpired) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-neutral-100 px-2.5 py-1 text-xs font-semibold text-neutral-600 border border-neutral-200">
        <Clock className="size-3.5" />
        Expired
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#fef3ec] px-2.5 py-1 text-xs font-semibold text-[#9a3412] border border-[#fae2d3]">
      <span className="size-1.5 rounded-full bg-[#e8631b] animate-pulse" />
      Pending
    </span>
  );
}
