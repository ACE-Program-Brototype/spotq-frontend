import { Eye, Mail, Send, Trash2 } from "lucide-react";
import { useMemo } from "react";
import { Spinner } from "@/components/common/LoadingIndicator";
import type { Column } from "@/components/common/table";
import { StaffInvitationStatusBadge } from "../components/StaffInvitationStatusBadge";
import type { StaffInvitation } from "../types/staff-invitation.types";

interface UseStaffInvitationColumnsOptions {
  isResending: string | null;
  isRevoking: string | null;
  onOpenDetails: (invitation: StaffInvitation) => void;
  onResend: (email: string) => void;
  onRevokeTarget: (invitation: StaffInvitation) => void;
}

export function useStaffInvitationColumns({
  isResending,
  isRevoking,
  onOpenDetails,
  onResend,
  onRevokeTarget,
}: UseStaffInvitationColumnsOptions): Column<StaffInvitation>[] {
  return useMemo<Column<StaffInvitation>[]>(
    () => [
      {
        key: "email",
        header: "Invited Email",
        sortable: true,
        cell: ({ row: invitation }) => (
          <div className="flex items-center gap-2.5">
            <div className="size-8 rounded-xl bg-[#faf7f5] border border-[#eddcd4] flex items-center justify-center text-neutral-600 shrink-0">
              <Mail className="size-4 text-[#e8631b]" />
            </div>
            <div>
              <p className="font-semibold text-neutral-900 break-all">{invitation.email}</p>
              <p className="text-[10px] text-neutral-400 font-mono">
                ID: {invitation.id.slice(0, 8)}...
              </p>
            </div>
          </div>
        ),
      },
      {
        key: "status",
        header: "Status",
        cell: ({ row: invitation }) => <StaffInvitationStatusBadge invitation={invitation} />,
      },
      {
        key: "createdAt",
        header: "Date Sent",
        sortable: true,
        cell: ({ row: invitation }) => (
          <span className="text-neutral-500 font-medium whitespace-nowrap">
            {new Date(invitation.createdAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </span>
        ),
      },
      {
        key: "expiresAt",
        header: "Expires",
        sortable: true,
        cell: ({ row: invitation }) => (
          <span className="text-neutral-500 font-medium whitespace-nowrap">
            {new Date(invitation.expiresAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </span>
        ),
      },
      {
        key: "actions",
        header: "Actions",
        align: "right",
        cell: ({ row: invitation }) => (
          <div className="flex items-center justify-end gap-1.5">
            <button
              type="button"
              onClick={() => onOpenDetails(invitation)}
              className="rounded-lg p-2 text-neutral-500 hover:text-[#9a3412] hover:bg-[#fef3ec] transition-colors"
              title="View Details"
              aria-label="View Details"
            >
              <Eye className="size-4" />
            </button>

            {invitation.status !== "ACCEPTED" && (
              <button
                type="button"
                onClick={() => onResend(invitation.email)}
                disabled={isResending === invitation.email}
                className="rounded-lg p-2 text-neutral-500 hover:text-[#9a3412] hover:bg-[#fef3ec] transition-colors disabled:opacity-50"
                title="Resend Invitation Link"
                aria-label="Resend Invitation Link"
              >
                {isResending === invitation.email ? (
                  <Spinner size="sm" theme="brand" />
                ) : (
                  <Send className="size-4" />
                )}
              </button>
            )}

            {invitation.status === "PENDING" && (
              <button
                type="button"
                onClick={() => onRevokeTarget(invitation)}
                disabled={isRevoking === invitation.id}
                className="rounded-lg p-2 text-neutral-500 hover:text-rose-600 hover:bg-rose-50 transition-colors disabled:opacity-50"
                title="Revoke Invitation"
                aria-label="Revoke Invitation"
              >
                <Trash2 className="size-4" />
              </button>
            )}
          </div>
        ),
      },
    ],
    [isResending, isRevoking, onOpenDetails, onResend, onRevokeTarget],
  );
}
