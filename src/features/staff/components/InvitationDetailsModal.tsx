import { Calendar, CheckCircle2, Clock, Mail, ShieldAlert, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { StaffInvitation } from "@/features/staff/types/staff-invitation.types";
import { cn } from "@/lib/utils/cn";
import { formatDate } from "@/lib/utils/date";

type InvitationDetailsModalProps = {
  invitation: StaffInvitation | null;
  isOpen: boolean;
  onClose: () => void;
  onResend?: (email: string) => void;
  onRevoke?: (id: string, email?: string) => void;
};

export function InvitationDetailsModal({
  invitation,
  isOpen,
  onClose,
  onResend,
  onRevoke,
}: InvitationDetailsModalProps) {
  if (!isOpen || !invitation) return null;

  const isExpired =
    invitation.status === "EXPIRED" ||
    (invitation.status === "PENDING" && new Date(invitation.expiresAt) < new Date());

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ACCEPTED":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="size-3.5" />
            Accepted
          </span>
        );
      case "PENDING":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#fef3ec] px-2.5 py-1 text-xs font-semibold text-[#9a3412] border border-[#fae2d3]">
            <span className="size-1.5 rounded-full bg-[#e8631b] animate-pulse" />
            Pending Acceptance
          </span>
        );
      case "REVOKED":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 px-2.5 py-1 text-xs font-semibold text-rose-700 border border-rose-200">
            <ShieldAlert className="size-3.5" />
            Revoked
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-neutral-100 px-2.5 py-1 text-xs font-semibold text-neutral-600 border border-neutral-200">
            <Clock className="size-3.5" />
            Expired
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/50 backdrop-blur-xs">
      <div
        className="relative w-full max-w-md rounded-2xl bg-white border border-[#eddcd4] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#f3e6de] bg-[#fffcf9]">
          <div className="flex items-center gap-2">
            <div className="size-8 rounded-xl bg-[#fef3ec] flex items-center justify-center text-[#9a3412] border border-[#fae2d3]">
              <Mail className="size-4" />
            </div>
            <h3 id="modal-title" className="text-base font-bold text-neutral-900">
              Invitation Details
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors"
            aria-label="Close"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-4 text-sm">
          <div className="flex items-center justify-between p-3 rounded-xl bg-[#faf7f5] border border-[#eddcd4]">
            <span className="text-xs font-semibold text-neutral-500">Status</span>
            <div>{getStatusBadge(isExpired ? "EXPIRED" : invitation.status)}</div>
          </div>

          <div className="space-y-3">
            <div>
              <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                Invited Email
              </p>
              <div className="mt-1 flex items-center gap-2 font-medium text-neutral-900 break-all p-2.5 rounded-lg bg-neutral-50 border border-neutral-200/80">
                <Mail className="size-4 text-[#e8631b] shrink-0" />
                <span>{invitation.email}</span>
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                Invitation ID
              </p>
              <p className="mt-1 font-mono text-xs text-neutral-600 bg-neutral-50 p-2 rounded-lg border border-neutral-200/60 truncate">
                {invitation.id}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="p-3 rounded-xl bg-[#faf7f5] border border-[#eddcd4]">
                <div className="flex items-center gap-1.5 text-xs text-neutral-500 font-medium">
                  <Calendar className="size-3.5 text-neutral-400" />
                  <span>Sent On</span>
                </div>
                <p className="mt-1 text-xs font-semibold text-neutral-900">
                  {formatDate(invitation.createdAt)}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-[#faf7f5] border border-[#eddcd4]">
                <div className="flex items-center gap-1.5 text-xs text-neutral-500 font-medium">
                  <Clock className="size-3.5 text-neutral-400" />
                  <span>Expires At</span>
                </div>
                <p
                  className={cn(
                    "mt-1 text-xs font-semibold",
                    isExpired ? "text-rose-600" : "text-neutral-900",
                  )}
                >
                  {formatDate(invitation.expiresAt)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-[#f3e6de] bg-[#fffcf9]">
          <div>
            {invitation.status === "PENDING" && onRevoke && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  onRevoke(invitation.id, invitation.email);
                  onClose();
                }}
                className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 border-rose-200"
              >
                Revoke Invitation
              </Button>
            )}
          </div>

          <div className="flex items-center gap-2">
            {invitation.status !== "ACCEPTED" && onResend && (
              <Button
                size="sm"
                onClick={() => {
                  onResend(invitation.email);
                  onClose();
                }}
                className="bg-[#e8631b] hover:bg-[#d45614] text-white"
              >
                Resend Link
              </Button>
            )}
            <Button variant="outline" size="sm" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
