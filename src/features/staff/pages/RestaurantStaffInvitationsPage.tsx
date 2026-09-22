import {
  ArrowLeft,
  CheckCircle2,
  ChevronDown,
  Clock,
  Eye,
  Mail,
  RotateCw,
  Search,
  Send,
  ShieldAlert,
  Trash2,
  UserPlus,
} from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { Spinner } from "@/components/common/LoadingIndicator";
import { type Column, DataTable } from "@/components/common/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { InvitationDetailsModal } from "@/features/staff/components/InvitationDetailsModal";
import { InviteStaffModal } from "@/features/staff/components/InviteStaffModal";
import { useStaffInvitations } from "@/features/staff/hooks/use-staff-invitations";
import type {
  StaffInvitation,
  StaffInvitationSortBy,
} from "@/features/staff/types/staff-invitation.types";
import { cn } from "@/lib/utils/cn";

export default function RestaurantStaffInvitationsPage() {
  const {
    invitations,
    stats,
    isLoading,
    isSending,
    isResending,
    isRevoking,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    setPage,
    pagination,
    sendInvitation,
    resendInvitation,
    revokeInvitation,
    refreshInvitations,
  } = useStaffInvitations();

  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [selectedInvitation, setSelectedInvitation] = useState<StaffInvitation | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [revokeTarget, setRevokeTarget] = useState<StaffInvitation | null>(null);

  const getStatusBadge = useCallback((invitation: StaffInvitation) => {
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
  }, []);

  const handleOpenDetails = useCallback((invitation: StaffInvitation) => {
    setSelectedInvitation(invitation);
    setIsDetailsModalOpen(true);
  }, []);

  const columns = useMemo<Column<StaffInvitation>[]>(
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
        cell: ({ row: invitation }) => getStatusBadge(invitation),
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
              onClick={() => handleOpenDetails(invitation)}
              className="rounded-lg p-2 text-neutral-500 hover:text-[#9a3412] hover:bg-[#fef3ec] transition-colors"
              title="View Details"
              aria-label="View Details"
            >
              <Eye className="size-4" />
            </button>

            {invitation.status !== "ACCEPTED" && (
              <button
                type="button"
                onClick={() => resendInvitation(invitation.email)}
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
                onClick={() => setRevokeTarget(invitation)}
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
    [isResending, isRevoking, resendInvitation, getStatusBadge, handleOpenDetails],
  );

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            to="/restaurant/staff"
            className="rounded-xl p-2 text-neutral-500 hover:bg-[#fef3ec] hover:text-[#9a3412] transition-colors"
            title="Back to Staff Directory"
            aria-label="Back to Staff Directory"
          >
            <ArrowLeft className="size-5" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-[0.15em] text-[#9a3412]">
                Staff Onboarding
              </span>
            </div>
            <h1 className="mt-1 text-2xl sm:text-3xl font-bold text-neutral-900">
              Invitations Directory
            </h1>
            <p className="mt-1 text-sm text-neutral-500">
              Track status, resend activation links, or revoke dispatched onboarding invites.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => refreshInvitations()}
            disabled={isLoading}
            className="rounded-xl border-[#eddcd4] bg-white text-neutral-700 hover:bg-[#faf7f5] shadow-2xs"
            title="Refresh list"
          >
            <RotateCw className={cn("size-4", isLoading && "animate-spin text-[#e8631b]")} />
          </Button>

          <Button
            size="sm"
            onClick={() => setIsInviteModalOpen(true)}
            className="rounded-xl bg-[#e8631b] hover:bg-[#d45614] text-white shadow-xs gap-1.5"
          >
            <UserPlus className="size-4" />
            <span>Invite Staff</span>
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
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

      {/* Main Table Card */}
      <div className="rounded-2xl border border-[#eddcd4] bg-white shadow-2xs overflow-hidden">
        {/* Filter bar */}
        <div className="p-4 sm:p-5 border-b border-[#f3e6de] bg-[#fffcf9] flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-neutral-400" />
            <Input
              type="text"
              placeholder="Search by recipient email address..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-10 rounded-xl border-[#eddcd4] bg-white focus:border-[#e8631b] focus:ring-1 focus:ring-[#e8631b]"
            />
          </div>

          <div className="flex items-center gap-3">
            {/* Status dropdown */}
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="h-10 pl-3 pr-8 rounded-xl border border-[#eddcd4] bg-white text-xs font-medium text-neutral-700 hover:bg-[#faf7f5] appearance-none focus:outline-none focus:border-[#e8631b]"
              >
                <option value="ALL">All Statuses</option>
                <option value="PENDING">Pending</option>
                <option value="ACCEPTED">Accepted</option>
                <option value="EXPIRED">Expired</option>
                <option value="REVOKED">Revoked</option>
              </select>
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 size-3.5 text-neutral-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Reusable DataTable */}
        <DataTable
          data={invitations}
          columns={columns}
          isLoading={isLoading}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSort={(key, dir) => {
            setSortBy(key as StaffInvitationSortBy);
            setSortOrder(dir ?? "desc");
          }}
          loadingRenderer={
            <div className="py-20 flex flex-col items-center justify-center text-center">
              <Spinner size="lg" theme="brand" />
              <p className="mt-3 text-xs font-medium text-neutral-500">Loading invitations...</p>
            </div>
          }
          emptyState={
            <div className="py-16 px-4 text-center">
              <div className="mx-auto size-16 rounded-2xl bg-[#fef3ec] border border-[#fae2d3] flex items-center justify-center text-[#9a3412] mb-4">
                <Mail className="size-8 text-[#e8631b]" />
              </div>
              <h3 className="text-base font-bold text-neutral-900">No invitations found</h3>
              <p className="mt-1 text-xs text-neutral-500 max-w-sm mx-auto">
                {searchQuery || statusFilter !== "ALL"
                  ? "No invitations match your search filter criteria."
                  : "No staff invitations have been dispatched yet."}
              </p>
              <div className="mt-5">
                <Button
                  onClick={() => setIsInviteModalOpen(true)}
                  className="rounded-xl bg-[#e8631b] hover:bg-[#d45614] text-white"
                >
                  <UserPlus className="size-4 mr-2" />
                  Send First Invitation
                </Button>
              </div>
            </div>
          }
          pagination={
            pagination.totalPages > 1
              ? {
                  currentPage: pagination.page,
                  totalPages: pagination.totalPages,
                  totalItems: pagination.total,
                  pageSize: pagination.limit || 20,
                  onPageChange: (p) => setPage(p),
                  theme: "restaurant",
                }
              : undefined
          }
          theme="restaurant"
          className="border-0 rounded-none shadow-none"
          headerClassName="bg-[#faf7f5] text-neutral-500 font-semibold border-b border-[#eddcd4]"
        />
      </div>

      {/* Invite Modal */}
      <InviteStaffModal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        onSend={sendInvitation}
        isLoading={isSending}
      />

      {/* Details Modal */}
      <InvitationDetailsModal
        invitation={selectedInvitation}
        isOpen={isDetailsModalOpen}
        onClose={() => {
          setIsDetailsModalOpen(false);
          setSelectedInvitation(null);
        }}
        onResend={resendInvitation}
        onRevoke={(id, email) => {
          setIsDetailsModalOpen(false);
          revokeInvitation(id, email);
        }}
      />

      {/* Confirm Revoke Dialog */}
      <ConfirmDialog
        open={!!revokeTarget}
        title="Revoke Invitation?"
        description={`Are you sure you want to revoke the invitation sent to ${revokeTarget?.email}? They will no longer be able to use the link to register.`}
        confirmText="Yes, Revoke"
        cancelText="Keep Active"
        confirmVariant="destructive"
        onConfirm={async () => {
          if (revokeTarget) {
            await revokeInvitation(revokeTarget.id, revokeTarget.email);
            setRevokeTarget(null);
          }
        }}
        onCancel={() => setRevokeTarget(null)}
      />
    </div>
  );
}
