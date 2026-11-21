import { ArrowLeft, ChevronDown, Mail, RotateCw, Search, UserPlus } from "lucide-react";
import { useCallback, useState } from "react";
import { Link } from "react-router-dom";
import { RESTAURANT_ROUTES } from "@/app/router/routes.constants";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { Spinner } from "@/components/common/LoadingIndicator";
import { DataTable } from "@/components/common/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { InvitationDetailsModal } from "@/features/staff/components/InvitationDetailsModal";
import { InviteStaffModal } from "@/features/staff/components/InviteStaffModal";
import { StaffInvitationsStatsCards } from "@/features/staff/components/StaffInvitationsStatsCards";
import { useStaffInvitationColumns } from "@/features/staff/hooks/use-staff-invitation-columns";
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

  const handleOpenDetails = useCallback((invitation: StaffInvitation) => {
    setSelectedInvitation(invitation);
    setIsDetailsModalOpen(true);
  }, []);

  const handleRevokeTarget = useCallback((invitation: StaffInvitation) => {
    setRevokeTarget(invitation);
  }, []);

  const columns = useStaffInvitationColumns({
    isResending,
    isRevoking,
    onOpenDetails: handleOpenDetails,
    onResend: resendInvitation,
    onRevokeTarget: handleRevokeTarget,
  });

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            to={RESTAURANT_ROUTES.STAFF.ROOT}
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
      <StaffInvitationsStatsCards stats={stats} />

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
