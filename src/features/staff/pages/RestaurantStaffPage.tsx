import {
  AlertCircle,
  Briefcase,
  ChevronDown,
  Mail,
  RefreshCw,
  Search,
  UserPlus,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { RESTAURANT_ROUTES } from "@/app/router/routes.constants";
import { Spinner } from "@/components/common/LoadingIndicator";
import { DataTable } from "@/components/common/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { InviteStaffModal } from "@/features/staff/components/InviteStaffModal";
import { RestaurantStaffStatsCards } from "@/features/staff/components/RestaurantStaffStatsCards";
import { useRestaurantStaffColumns } from "@/features/staff/hooks/use-restaurant-staff-columns";
import { useStaffInvitations } from "@/features/staff/hooks/use-staff-invitations";
import { useStaffMembers } from "@/features/staff/hooks/use-staff-members";

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

  const columns = useRestaurantStaffColumns();

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

          <Link to={RESTAURANT_ROUTES.STAFF.INVITATIONS}>
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
        <div
          role="alert"
          className="rounded-2xl border border-red-200 bg-red-50 p-4 flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <AlertCircle className="size-5 text-red-600 shrink-0" />
            <div>
              <p className="text-sm font-semibold text-red-900">Failed to load staff members</p>
              <p className="text-xs text-red-700 mt-0.5">{error}</p>
            </div>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={() => refreshStaffMembers()}
            className="rounded-xl border-red-200 text-red-700 hover:bg-red-100"
          >
            Try Again
          </Button>
        </div>
      )}

      {/* KPI Stats Cards */}
      <RestaurantStaffStatsCards stats={stats} pendingInvites={invitationStats.pending} />

      {/* Main Staff Table Card */}
      <div className="rounded-2xl border border-[#eddcd4] bg-white shadow-2xs overflow-hidden">
        {/* Search & Filters Header */}
        <div className="p-4 sm:p-5 border-b border-[#f3e6de] bg-[#fffcf9] flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-neutral-400" />
            <Input
              type="text"
              placeholder="Search by staff name, code, email, or designation..."
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
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
                <option value="SUSPENDED">Suspended</option>
                <option value="INVITED">Invited</option>
                <option value="REMOVED">Removed</option>
              </select>
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 size-3.5 text-neutral-400 pointer-events-none" />
            </div>

            {(searchQuery || statusFilter !== "ALL") && (
              <Button
                variant="ghost"
                size="sm"
                onClick={resetFilters}
                className="text-xs text-neutral-500 hover:text-neutral-900 rounded-xl h-10 px-3"
              >
                Reset Filters
              </Button>
            )}
          </div>
        </div>

        {/* Reusable DataTable Component */}
        <DataTable
          data={staffList}
          columns={columns}
          isLoading={isLoading}
          sortBy={sortBy}
          sortOrder={sortOrder === "ASC" ? "asc" : "desc"}
          onSort={() => toggleSort("createdAt")}
          loadingRenderer={
            <div className="py-20 flex flex-col items-center justify-center text-center">
              <Spinner size="lg" theme="brand" />
              <p className="mt-3 text-xs font-medium text-neutral-500">Loading staff members...</p>
            </div>
          }
          emptyState={
            <div className="py-16 px-4 text-center">
              <div className="mx-auto size-16 rounded-2xl bg-[#fef3ec] border border-[#fae2d3] flex items-center justify-center text-[#9a3412] mb-4">
                <Briefcase className="size-8 text-[#e8631b]" />
              </div>
              <h3 className="text-base font-bold text-neutral-900">No staff members found</h3>
              <p className="mt-1 text-xs text-neutral-500 max-w-sm mx-auto">
                {searchQuery || statusFilter !== "ALL"
                  ? "No staff members match your filter criteria. Try adjusting your search query or status filter."
                  : "You haven't added any staff members to your restaurant yet."}
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
                  pageSize: pagination.limit || 10,
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
