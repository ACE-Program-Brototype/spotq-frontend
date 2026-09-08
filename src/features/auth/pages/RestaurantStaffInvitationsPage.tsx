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
import { useState } from "react";
import { Link } from "react-router-dom";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { Spinner } from "@/components/common/LoadingIndicator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { InvitationDetailsModal } from "@/features/auth/components/InvitationDetailsModal";
import { InviteStaffModal } from "@/features/auth/components/InviteStaffModal";
import { useStaffInvitations } from "@/features/auth/hooks/use-staff-invitations";
import type {
  StaffInvitation,
  StaffInvitationSortBy,
  StaffInvitationSortOrder,
} from "@/features/auth/types/staff-invitation.types";
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
    page,
    setPage,
    limit,
    setLimit,
    pagination,
    sendInvitation,
    resendInvitation,
    revokeInvitation,
    refreshInvitations,
  } = useStaffInvitations();

  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [selectedInvitation, setSelectedInvitation] = useState<StaffInvitation | null>(null);
  const [quickEmail, setQuickEmail] = useState("");

  const handleQuickSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickEmail?.includes("@")) return;
    const success = await sendInvitation(quickEmail.trim());
    if (success) {
      setQuickEmail("");
    }
  };

  const getStatusBadge = (status: string, expiresAt: string) => {
    const isExpired =
      status === "EXPIRED" || (status === "PENDING" && new Date(expiresAt) < new Date());

    if (isExpired) {
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-neutral-100 px-2.5 py-0.5 text-xs font-semibold text-neutral-600 border border-neutral-200">
          <Clock className="size-3 text-neutral-400" />
          Expired
        </span>
      );
    }

    switch (status) {
      case "ACCEPTED":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="size-3 text-emerald-600" />
            Accepted
          </span>
        );
      case "PENDING":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#fef3ec] px-2.5 py-0.5 text-xs font-semibold text-[#9a3412] border border-[#fae2d3]">
            <span className="size-1.5 rounded-full bg-[#e8631b] animate-pulse" />
            Pending
          </span>
        );
      case "REVOKED":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 px-2.5 py-0.5 text-xs font-semibold text-rose-700 border border-rose-200">
            <ShieldAlert className="size-3 text-rose-600" />
            Revoked
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-neutral-100 px-2.5 py-0.5 text-xs font-semibold text-neutral-600">
            {status}
          </span>
        );
    }
  };

  const formatDate = (isoString?: string) => {
    if (!isoString) return "—";
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return isoString;
    }
  };

  return (
    <div className="space-y-6 max-w-full pb-12">
      {/* Breadcrumb & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-medium text-neutral-500 mb-1">
            <Link to="/restaurant/dashboard" className="hover:text-neutral-900 transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link to="/restaurant/staff" className="hover:text-neutral-900 transition-colors">
              Staff
            </Link>
            <span>/</span>
            <span className="text-[#9a3412] font-semibold">Invitations</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900">
            Staff Invitations
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-neutral-500">
            Send onboarding links, track pending acceptance, and manage employee access.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <Link
            to="/restaurant/staff"
            className="inline-flex items-center gap-1.5 rounded-xl border border-[#eddcd4] bg-white px-3.5 py-2 text-xs font-semibold text-neutral-700 hover:bg-[#faf7f5] transition-colors shadow-2xs"
          >
            <ArrowLeft className="size-3.5" />
            Staff Directory
          </Link>
          <Button
            onClick={() => setIsInviteModalOpen(true)}
            className="rounded-xl bg-[#e8631b] hover:bg-[#d45614] text-white shadow-xs text-xs font-semibold px-4 py-2"
          >
            <UserPlus className="size-3.5 mr-1.5" />
            Invite Staff
          </Button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="rounded-2xl border border-[#eddcd4] bg-white p-4.5 shadow-2xs">
          <div className="flex items-center justify-between">
            <div className="size-9 rounded-xl bg-[#fef3ec] flex items-center justify-center text-[#9a3412] border border-[#fae2d3]">
              <Mail className="size-4.5 text-[#e8631b]" />
            </div>
            <span className="text-[11px] font-semibold text-neutral-500">Total</span>
          </div>
          <div className="mt-3">
            <p className="text-2xl font-bold text-neutral-900">{stats.total}</p>
            <p className="text-[11px] font-medium text-neutral-500">All Invitations</p>
          </div>
        </div>

        <div className="rounded-2xl border border-[#fae2d3] bg-[#fffaf6] p-4.5 shadow-2xs">
          <div className="flex items-center justify-between">
            <div className="size-9 rounded-xl bg-[#fef3ec] flex items-center justify-center text-[#9a3412] border border-[#fae2d3]">
              <Clock className="size-4.5 text-[#e8631b]" />
            </div>
            <span className="text-[11px] font-bold text-[#9a3412]">Awaiting</span>
          </div>
          <div className="mt-3">
            <p className="text-2xl font-bold text-[#9a3412]">{stats.pending}</p>
            <p className="text-[11px] font-medium text-neutral-500">Pending Acceptance</p>
          </div>
        </div>

        <div className="rounded-2xl border border-[#eddcd4] bg-white p-4.5 shadow-2xs">
          <div className="flex items-center justify-between">
            <div className="size-9 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 border border-emerald-200">
              <CheckCircle2 className="size-4.5" />
            </div>
            <span className="text-[11px] font-semibold text-emerald-700">Joined</span>
          </div>
          <div className="mt-3">
            <p className="text-2xl font-bold text-neutral-900">{stats.accepted}</p>
            <p className="text-[11px] font-medium text-neutral-500">Accepted</p>
          </div>
        </div>

        <div className="rounded-2xl border border-[#eddcd4] bg-white p-4.5 shadow-2xs">
          <div className="flex items-center justify-between">
            <div className="size-9 rounded-xl bg-neutral-100 flex items-center justify-center text-neutral-500 border border-neutral-200">
              <ShieldAlert className="size-4.5" />
            </div>
            <span className="text-[11px] font-semibold text-neutral-500">Inactive</span>
          </div>
          <div className="mt-3">
            <p className="text-2xl font-bold text-neutral-900">{stats.expired + stats.revoked}</p>
            <p className="text-[11px] font-medium text-neutral-500">Expired / Revoked</p>
          </div>
        </div>
      </div>

      {/* Quick Invite Box */}
      <div className="rounded-2xl border border-[#eddcd4] bg-gradient-to-r from-[#fffcf9] via-white to-[#fffaf6] p-4 sm:p-5 shadow-2xs">
        <form
          onSubmit={handleQuickSend}
          className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3"
        >
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-[#fef3ec] flex items-center justify-center text-[#9a3412] border border-[#fae2d3] shrink-0">
              <Send className="size-4.5 text-[#e8631b]" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-neutral-900 leading-tight">
                Quick Staff Invitation
              </h2>
              <p className="text-xs text-neutral-500">
                Type an email address to send an instant registration invitation link.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 max-w-md w-full sm:w-auto">
            <div className="relative flex-1 sm:w-72">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-neutral-400" />
              <Input
                type="email"
                placeholder="staff@restaurant.com"
                value={quickEmail}
                onChange={(e) => setQuickEmail(e.target.value)}
                disabled={isSending}
                className="pl-9.5 h-9.5 rounded-xl border-[#eddcd4] bg-white text-xs focus:border-[#e8631b] focus:ring-1 focus:ring-[#e8631b]"
              />
            </div>
            <Button
              type="submit"
              disabled={isSending || !quickEmail}
              className="h-9.5 rounded-xl bg-[#e8631b] hover:bg-[#d45614] text-white text-xs font-semibold px-4 shrink-0"
            >
              {isSending ? (
                <div className="flex items-center gap-1.5">
                  <Spinner size="sm" theme="white" />
                  <span>Sending...</span>
                </div>
              ) : (
                "Send Link"
              )}
            </Button>
          </div>
        </form>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-[#eddcd4] bg-white p-3 shadow-2xs">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-neutral-400" />
          <Input
            type="text"
            placeholder="Search invitation by email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-9 rounded-xl border-[#eddcd4] bg-[#faf7f5]/40 text-xs focus:border-[#e8631b]"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {(["ALL", "PENDING", "ACCEPTED", "EXPIRED", "REVOKED"] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setStatusFilter(tab)}
              className={cn(
                "rounded-xl px-3 py-1.5 text-xs font-semibold transition-all whitespace-nowrap",
                statusFilter === tab
                  ? "bg-[#fef3ec] text-[#9a3412] shadow-2xs border border-[#fae2d3]"
                  : "text-neutral-600 hover:bg-[#faf7f5] hover:text-neutral-900",
              )}
            >
              {tab.charAt(0) + tab.slice(1).toLowerCase()}
            </button>
          ))}

          {/* Sort Dropdown */}
          <div className="relative">
            <select
              value={`${sortBy}:${sortOrder}`}
              onChange={(e) => {
                const [field, order] = e.target.value.split(":");
                setSortBy(field as StaffInvitationSortBy);
                setSortOrder(order as StaffInvitationSortOrder);
              }}
              className="h-8.5 appearance-none rounded-xl border border-[#eddcd4] bg-[#faf7f5]/40 pl-2.5 pr-7 text-xs font-medium text-neutral-700 focus:border-[#e8631b] focus:outline-none cursor-pointer"
            >
              <option value="createdAt:desc">Sort: Newest</option>
              <option value="createdAt:asc">Sort: Oldest</option>
              <option value="expiresAt:asc">Sort: Expiring Soon</option>
              <option value="expiresAt:desc">Sort: Expiring Later</option>
              <option value="email:asc">Sort: Email (A-Z)</option>
              <option value="email:desc">Sort: Email (Z-A)</option>
              <option value="status:asc">Sort: Status (A-Z)</option>
              <option value="status:desc">Sort: Status (Z-A)</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 size-3 text-neutral-400" />
          </div>

          <button
            type="button"
            onClick={() => refreshInvitations()}
            disabled={isLoading}
            className="p-1.5 rounded-xl text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors"
            title="Refresh list"
            aria-label="Refresh list"
          >
            <RotateCw className={cn("size-4", isLoading && "animate-spin text-[#e8631b]")} />
          </button>
        </div>
      </div>

      {/* Invitations Table */}
      <div className="rounded-2xl border border-[#eddcd4] bg-white shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#eddcd4] bg-[#faf7f5]/80 text-neutral-500 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3.5 px-4 font-semibold">Invited Email</th>
                <th className="py-3.5 px-4 font-semibold">Status</th>
                <th className="py-3.5 px-4 font-semibold">Sent Date</th>
                <th className="py-3.5 px-4 font-semibold">Expires Date</th>
                <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f3e6de]">
              {isLoading ? (
                ["sk-1", "sk-2", "sk-3", "sk-4", "sk-5"]
                  .slice(0, Math.min(limit, 5))
                  .map((skId) => (
                    <tr key={skId} className="animate-pulse">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="size-7 rounded-lg bg-[#f3e6de]/70" />
                          <div className="space-y-1.5">
                            <div className="h-3.5 w-36 bg-[#f3e6de]/70 rounded-md" />
                            <div className="h-2.5 w-20 bg-[#f3e6de]/40 rounded-md" />
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="h-5 w-20 bg-[#f3e6de]/70 rounded-full" />
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="h-3.5 w-24 bg-[#f3e6de]/60 rounded-md" />
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="h-3.5 w-24 bg-[#f3e6de]/60 rounded-md" />
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="h-6 w-16 bg-[#f3e6de]/50 rounded-lg ml-auto" />
                      </td>
                    </tr>
                  ))
              ) : invitations.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-neutral-400">
                    <Mail className="size-8 mx-auto text-neutral-300 mb-2" />
                    <p className="font-semibold text-neutral-700">No invitations found</p>
                    <p className="text-xs text-neutral-400 mt-0.5">
                      Try adjusting your search filter or invite a new staff member.
                    </p>
                  </td>
                </tr>
              ) : (
                invitations.map((inv) => {
                  const isExpired =
                    inv.status === "EXPIRED" ||
                    (inv.status === "PENDING" && new Date(inv.expiresAt) < new Date());

                  return (
                    <tr
                      key={inv.id}
                      className="hover:bg-[#faf7f5]/50 transition-colors group select-none"
                    >
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="size-7 rounded-lg bg-[#fef3ec] flex items-center justify-center text-[#9a3412] border border-[#fae2d3]">
                            <Mail className="size-3.5 text-[#e8631b]" />
                          </div>
                          <div>
                            <p className="font-semibold text-neutral-900">{inv.email}</p>
                            <p className="font-mono text-[10px] text-neutral-400">{inv.id}</p>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">{getStatusBadge(inv.status, inv.expiresAt)}</td>

                      <td className="py-3.5 px-4 text-neutral-600 font-medium">
                        {formatDate(inv.createdAt)}
                      </td>

                      <td
                        className={cn(
                          "py-3.5 px-4 font-medium",
                          isExpired ? "text-rose-600" : "text-neutral-600",
                        )}
                      >
                        {formatDate(inv.expiresAt)}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* View Details */}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedInvitation(inv)}
                            className="h-7 px-2 text-neutral-600 hover:text-neutral-900 hover:bg-[#fef3ec] text-xs"
                            title="View details"
                          >
                            <Eye className="size-3.5 mr-1" />
                            View
                          </Button>

                          {/* Resend Link */}
                          {inv.status !== "ACCEPTED" && (
                            <Button
                              variant="ghost"
                              size="sm"
                              disabled={isResending === inv.email}
                              onClick={() => resendInvitation(inv.email)}
                              className="h-7 px-2 text-[#9a3412] hover:bg-[#fef3ec] text-xs font-semibold"
                              title="Resend invitation email"
                            >
                              <RotateCw
                                className={cn(
                                  "size-3.5 mr-1",
                                  isResending === inv.email && "animate-spin",
                                )}
                              />
                              Resend
                            </Button>
                          )}

                          {/* Revoke Link */}
                          {inv.status === "PENDING" && !isExpired && (
                            <ConfirmDialog
                              trigger={
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  disabled={isRevoking === inv.id}
                                  className="h-7 px-2 text-rose-600 hover:bg-rose-50 text-xs"
                                  title="Revoke invitation"
                                >
                                  <Trash2 className="size-3.5 mr-1" />
                                  Revoke
                                </Button>
                              }
                              title="Revoke Invitation"
                              description={`Are you sure you want to revoke the invitation for ${inv.email}? The link will immediately stop working.`}
                              confirmText="Revoke"
                              confirmVariant="destructive"
                              onConfirm={() => revokeInvitation(inv.id, inv.email)}
                            />
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 border-t border-[#eddcd4] bg-[#faf7f5]/40 text-xs text-neutral-600">
          <div className="flex items-center gap-2">
            <span>
              Showing{" "}
              <strong>
                {pagination.total === 0 ? 0 : (page - 1) * limit + 1}-
                {Math.min(page * limit, pagination.total)}
              </strong>{" "}
              of <strong>{pagination.total}</strong> invitations
            </span>

            {/* Page Size Select */}
            <div className="flex items-center gap-1.5 ml-2">
              <span className="text-neutral-400">|</span>
              <span className="text-neutral-500 text-[11px]">Rows:</span>
              <select
                value={limit}
                onChange={(e) => setLimit(Number(e.target.value))}
                className="h-7 rounded-lg border border-[#eddcd4] bg-white px-2 text-xs text-neutral-700 focus:outline-none focus:border-[#e8631b]"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled={page <= 1 || isLoading}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="size-7 rounded-lg border border-[#eddcd4] bg-white flex items-center justify-center text-neutral-600 hover:bg-[#faf7f5] disabled:opacity-40 disabled:pointer-events-none transition-colors"
              title="Previous page"
            >
              &lt;
            </button>

            {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
              let pageNum = i + 1;
              if (pagination.totalPages > 5 && page > 3) {
                pageNum = page - 2 + i;
                if (pageNum > pagination.totalPages) {
                  pageNum = pagination.totalPages - 4 + i;
                }
              }
              if (pageNum < 1 || pageNum > pagination.totalPages) return null;

              return (
                <button
                  key={pageNum}
                  type="button"
                  onClick={() => setPage(pageNum)}
                  className={cn(
                    "size-7 rounded-lg text-xs font-semibold transition-colors",
                    page === pageNum
                      ? "bg-[#e8631b] text-white shadow-2xs"
                      : "border border-[#eddcd4] bg-white text-neutral-700 hover:bg-[#faf7f5]",
                  )}
                >
                  {pageNum}
                </button>
              );
            })}

            <button
              type="button"
              disabled={page >= pagination.totalPages || isLoading}
              onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
              className="size-7 rounded-lg border border-[#eddcd4] bg-white flex items-center justify-center text-neutral-600 hover:bg-[#faf7f5] disabled:opacity-40 disabled:pointer-events-none transition-colors"
              title="Next page"
            >
              &gt;
            </button>
          </div>
        </div>
      </div>

      {/* Invite Modal */}
      <InviteStaffModal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        onSend={sendInvitation}
        isLoading={isSending}
      />

      {/* View Details Modal */}
      <InvitationDetailsModal
        invitation={selectedInvitation}
        isOpen={!!selectedInvitation}
        onClose={() => setSelectedInvitation(null)}
        onResend={(email) => resendInvitation(email)}
        onRevoke={(id, email) => revokeInvitation(id, email)}
      />
    </div>
  );
}
