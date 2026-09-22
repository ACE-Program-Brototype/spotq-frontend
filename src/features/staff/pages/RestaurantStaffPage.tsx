import {
  AlertCircle,
  Briefcase,
  ChevronDown,
  Eye,
  Filter,
  Mail,
  RefreshCw,
  Search,
  UserCheck,
  UserPlus,
  UserX,
} from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Spinner } from "@/components/common/LoadingIndicator";
import { type Column, DataTable } from "@/components/common/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { InviteStaffModal } from "@/features/staff/components/InviteStaffModal";
import { useStaffInvitations } from "@/features/staff/hooks/use-staff-invitations";
import { useStaffMembers } from "@/features/staff/hooks/use-staff-members";
import type { StaffMember } from "@/features/staff/types/staff-invitation.types";
import { getStaffInitials } from "@/features/staff/utils/staff.helpers";
import { formatDate } from "@/lib/utils/date";

export default function RestaurantStaffPage() {
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  const {
    staffList,
    isLoading,
    error,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    setPage,
    sortBy,
    sortOrder,
    toggleSort,
    pagination,
    stats,
    resetFilters,
    refreshStaffMembers,
  } = useStaffMembers();

  const { sendInvitation, isSending, stats: invitationStats } = useStaffInvitations();

  const handleSendInvitation = async (email: string): Promise<boolean> => {
    const success = await sendInvitation(email);
    if (success) {
      setIsInviteModalOpen(false);
      refreshStaffMembers();
    }
    return success;
  };

  const getStatusBadge = useCallback((status: string) => {
    switch (status?.toUpperCase()) {
      case "ACTIVE":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 border border-emerald-200">
            <span className="size-1.5 rounded-full bg-emerald-500" />
            Active
          </span>
        );
      case "INACTIVE":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-neutral-100 px-2.5 py-1 text-xs font-semibold text-neutral-600 border border-neutral-200">
            <span className="size-1.5 rounded-full bg-neutral-400" />
            Inactive
          </span>
        );
      case "SUSPENDED":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700 border border-amber-200">
            <span className="size-1.5 rounded-full bg-amber-500" />
            Suspended
          </span>
        );
      case "INVITED":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-sky-50 px-2.5 py-1 text-xs font-semibold text-sky-700 border border-sky-200">
            <span className="size-1.5 rounded-full bg-sky-500" />
            Invited
          </span>
        );
      case "REMOVED":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 px-2.5 py-1 text-xs font-semibold text-rose-700 border border-rose-200">
            <span className="size-1.5 rounded-full bg-rose-500" />
            Removed
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#fef3ec] px-2.5 py-1 text-xs font-semibold text-[#9a3412] border border-[#fae2d3]">
            <span className="size-1.5 rounded-full bg-[#e8631b]" />
            {status || "Active"}
          </span>
        );
    }
  }, []);

  const columns = useMemo<Column<StaffMember>[]>(
    () => [
      {
        key: "name",
        header: "Member",
        cell: ({ row: staff }) => (
          <div className="flex items-center gap-3">
            <Avatar className="size-9 border border-[#eddcd4]">
              <AvatarFallback className="bg-[#fef3ec] text-[#9a3412] font-semibold text-xs">
                {getStaffInitials(staff.name)}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-bold text-neutral-900 leading-snug">{staff.name}</p>
              <p className="text-[11px] text-neutral-400 font-mono">
                {staff.employeeCode || staff.id}
              </p>
            </div>
          </div>
        ),
      },
      {
        key: "contact",
        header: "Contact Details",
        cell: ({ row: staff }) => (
          <div>
            <p className="font-medium text-neutral-900">{staff.email}</p>
            <p className="text-[11px] text-neutral-400">{staff.phone}</p>
          </div>
        ),
      },
      {
        key: "role",
        header: "Role",
        cell: ({ row: staff }) => (
          <span className="inline-flex items-center rounded-lg bg-neutral-100 px-2.5 py-1 text-xs font-semibold text-neutral-700 border border-neutral-200">
            {staff.designation}
          </span>
        ),
      },
      {
        key: "status",
        header: "Status",
        cell: ({ row: staff }) => getStatusBadge(staff.status),
      },
      {
        key: "createdAt",
        sortKey: "createdAt",
        header: "Joined Date",
        sortable: true,
        cell: ({ row: staff }) => (
          <span className="text-neutral-500 font-medium whitespace-nowrap">
            {formatDate(staff.joinedDate)}
          </span>
        ),
      },
      {
        key: "actions",
        header: "Actions",
        align: "right",
        cell: ({ row: staff }) => (
          <div className="flex items-center justify-end">
            <Link
              to={`/restaurant/staff/${staff.id}`}
              className="rounded-lg p-1.5 text-neutral-400 hover:text-[#e8631b] hover:bg-[#fef3ec] transition-colors"
              aria-label={`View details for ${staff.name}`}
              title="View staff details"
            >
              <Eye className="size-4" />
            </Link>
          </div>
        ),
      },
    ],
    [getStatusBadge],
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-[0.15em] text-[#9a3412]">
              Team Management
            </span>
          </div>
          <h1 className="mt-1 text-2xl sm:text-3xl font-bold text-neutral-900">Restaurant Staff</h1>
          <p className="mt-1 text-sm text-neutral-500">
            Manage your employees, roles, operational permissions, and onboarding invitations.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => refreshStaffMembers()}
            disabled={isLoading}
            className="rounded-xl border-[#eddcd4] bg-white text-neutral-700 hover:bg-[#faf7f5] shadow-2xs"
            title="Refresh staff list"
          >
            <RefreshCw className={`size-4 ${isLoading ? "animate-spin text-[#e8631b]" : ""}`} />
          </Button>

          <Link to="/restaurant/staff/invitations">
            <Button
              variant="outline"
              size="sm"
              className="rounded-xl border-[#eddcd4] bg-white text-neutral-700 hover:bg-[#faf7f5] shadow-2xs gap-2"
            >
              <Mail className="size-4 text-[#e8631b]" />
              <span>Invitations</span>
              {invitationStats.pending > 0 && (
                <span className="ml-1 rounded-full bg-[#e8631b] px-1.5 py-0.2 text-[10px] font-bold text-white">
                  {invitationStats.pending}
                </span>
              )}
            </Button>
          </Link>

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

      {/* Error Alert */}
      {error && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="size-5 shrink-0" />
            <span>{error}</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => refreshStaffMembers()}
            className="border-rose-300 text-rose-800 hover:bg-rose-100 rounded-xl"
          >
            Retry
          </Button>
        </div>
      )}

      {/* Directory Metrics Overview */}
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
          <p className="mt-1 text-xs text-neutral-400">Can access system & queues</p>
        </div>

        <div className="rounded-2xl border border-[#eddcd4] bg-white p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-neutral-500">Pending Invites</p>
            <div className="size-8 rounded-xl bg-[#fef3ec] border border-[#fae2d3] flex items-center justify-center text-[#e8631b]">
              <Mail className="size-4" />
            </div>
          </div>
          <p className="mt-3 text-2xl font-bold text-[#e8631b]">{invitationStats.pending}</p>
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

      {/* Main Staff Directory Card */}
      <div className="rounded-2xl border border-[#eddcd4] bg-white shadow-2xs overflow-hidden">
        {/* Table Filter Toolbar */}
        <div className="p-4 sm:p-5 border-b border-[#f3e6de] bg-[#fffcf9] flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-neutral-400" />
            <Input
              type="text"
              placeholder="Search by name, email, phone or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-10 rounded-xl border-[#eddcd4] bg-white focus:border-[#e8631b] focus:ring-1 focus:ring-[#e8631b]"
            />
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            {/* Status filter */}
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="h-10 pl-3 pr-8 rounded-xl border border-[#eddcd4] bg-white text-xs font-medium text-neutral-700 hover:bg-[#faf7f5] appearance-none focus:outline-none focus:border-[#e8631b]"
              >
                <option value="ALL">All Statuses</option>
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
                <option value="SUSPENDED">Suspended</option>
                <option value="INVITED">Invited</option>
                <option value="REMOVED">Removed</option>
              </select>
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 size-3.5 text-neutral-400 pointer-events-none" />
            </div>

            <Button
              variant="outline"
              size="sm"
              className="h-10 rounded-xl border-[#eddcd4] text-neutral-600 hover:bg-[#faf7f5]"
              onClick={resetFilters}
            >
              <Filter className="size-3.5 mr-1.5 text-neutral-400" />
              Reset
            </Button>
          </div>
        </div>

        {/* Reusable DataTable Component */}
        <DataTable
          data={staffList}
          columns={columns}
          isLoading={isLoading}
          loadingRenderer={
            <div className="py-16 text-center">
              <Spinner className="mx-auto size-8 text-[#e8631b]" />
              <p className="mt-3 text-xs text-neutral-500">Loading staff members...</p>
            </div>
          }
          sortBy={sortBy}
          sortOrder={sortOrder === "ASC" ? "asc" : "desc"}
          onSort={() => toggleSort("createdAt")}
          emptyState={
            <div className="py-16 px-4 text-center">
              <div className="mx-auto size-16 rounded-2xl bg-[#fef3ec] border border-[#fae2d3] flex items-center justify-center text-[#9a3412] mb-4">
                <Briefcase className="size-8 text-[#e8631b]" />
              </div>
              <h3 className="text-base font-bold text-neutral-900">No staff members found</h3>
              <p className="mt-1 text-xs text-neutral-500 max-w-sm mx-auto">
                {searchQuery || statusFilter !== "ALL"
                  ? "No members match your active filters. Try resetting the filters."
                  : "You haven't added any staff members yet. Send an invitation to get started."}
              </p>
              <div className="mt-5 flex items-center justify-center gap-3">
                {searchQuery || statusFilter !== "ALL" ? (
                  <Button
                    onClick={resetFilters}
                    variant="outline"
                    className="rounded-xl border-[#eddcd4]"
                  >
                    Clear Filters
                  </Button>
                ) : (
                  <Button
                    onClick={() => setIsInviteModalOpen(true)}
                    className="rounded-xl bg-[#e8631b] hover:bg-[#d45614] text-white"
                  >
                    <UserPlus className="size-4 mr-2" />
                    Invite First Staff Member
                  </Button>
                )}
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
        onSend={handleSendInvitation}
        isLoading={isSending}
      />
    </div>
  );
}
