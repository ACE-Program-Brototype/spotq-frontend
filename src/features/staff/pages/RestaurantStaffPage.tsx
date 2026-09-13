import {
  Briefcase,
  ChevronDown,
  Filter,
  Mail,
  MoreVertical,
  Search,
  UserCheck,
  UserPlus,
  UserX,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { InviteStaffModal } from "@/features/staff/components/InviteStaffModal";
import { useStaffInvitations } from "@/features/staff/hooks/use-staff-invitations";
import type { StaffMember } from "@/features/staff/types/staff-invitation.types";
import { useDebounce } from "@/lib/hooks/use-debounce";

export default function RestaurantStaffPage() {
  const [staffList] = useState<StaffMember[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebounce(searchQuery, 300);
  const [designationFilter, setDesignationFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  const { sendInvitation, isSending, stats: invitationStats } = useStaffInvitations();

  const totalStaff = staffList.length;
  const activeStaff = staffList.filter((staff) => staff.status?.toUpperCase() === "ACTIVE").length;
  const inactiveStaff = staffList.filter(
    (staff) => staff.status?.toUpperCase() === "INACTIVE",
  ).length;

  const availableDesignations = Array.from(
    new Set(staffList.map((s) => s.designation).filter(Boolean)),
  );

  const filteredStaff = staffList.filter((staff) => {
    const matchesSearch =
      debouncedSearch.trim() === "" ||
      staff.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      staff.email.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      staff.phone.includes(debouncedSearch) ||
      staff.id.toLowerCase().includes(debouncedSearch.toLowerCase());

    const matchesDesignation =
      designationFilter === "ALL" || staff.designation === designationFilter;

    const matchesStatus =
      statusFilter === "ALL" || staff.status.toUpperCase() === statusFilter.toUpperCase();

    return matchesSearch && matchesDesignation && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
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
      default:
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#fef3ec] px-2.5 py-1 text-xs font-semibold text-[#9a3412] border border-[#fae2d3]">
            <span className="size-1.5 rounded-full bg-[#e8631b]" />
            {status || "Pending"}
          </span>
        );
    }
  };

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
          <Link to="/restaurant/staff/invitations">
            <Button
              variant="outline"
              className="rounded-xl border-[#eddcd4] bg-white text-neutral-700 hover:bg-[#faf7f5] shadow-2xs relative"
            >
              <Mail className="size-4 mr-2 text-[#9a3412]" />
              <span>Invitations</span>
              {invitationStats.pending > 0 && (
                <span className="ml-2 inline-flex items-center justify-center size-5 rounded-full bg-[#e8631b] text-white text-[10px] font-bold">
                  {invitationStats.pending}
                </span>
              )}
            </Button>
          </Link>

          <Button
            onClick={() => setIsInviteModalOpen(true)}
            className="rounded-xl bg-[#e8631b] hover:bg-[#d45614] text-white shadow-2xs transition-all"
          >
            <UserPlus className="size-4 mr-2" />
            Invite Staff
          </Button>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-[#eddcd4] bg-white p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-neutral-500">Total Staff</p>
            <div className="size-8 rounded-xl bg-[#faf7f5] border border-[#eddcd4] flex items-center justify-center text-neutral-700">
              <Briefcase className="size-4" />
            </div>
          </div>
          <p className="mt-3 text-2xl font-bold text-neutral-900">{totalStaff}</p>
          <p className="mt-1 text-xs text-neutral-400">Total registered members</p>
        </div>

        <div className="rounded-2xl border border-[#eddcd4] bg-white p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-neutral-500">Active Now</p>
            <div className="size-8 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
              <UserCheck className="size-4" />
            </div>
          </div>
          <p className="mt-3 text-2xl font-bold text-emerald-600">{activeStaff}</p>
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
          <p className="mt-3 text-2xl font-bold text-neutral-600">{inactiveStaff}</p>
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
            {/* Designation filter */}
            <div className="relative">
              <select
                value={designationFilter}
                onChange={(e) => setDesignationFilter(e.target.value)}
                className="h-10 pl-3 pr-8 rounded-xl border border-[#eddcd4] bg-white text-xs font-medium text-neutral-700 hover:bg-[#faf7f5] appearance-none focus:outline-none focus:border-[#e8631b]"
              >
                <option value="ALL">All Roles / Designations</option>
                {availableDesignations.map((desig) => (
                  <option key={desig} value={desig}>
                    {desig}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 size-3.5 text-neutral-400 pointer-events-none" />
            </div>

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
                <option value="PENDING">Pending</option>
              </select>
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 size-3.5 text-neutral-400 pointer-events-none" />
            </div>

            <Button
              variant="outline"
              size="sm"
              className="h-10 rounded-xl border-[#eddcd4] text-neutral-600 hover:bg-[#faf7f5]"
              onClick={() => {
                setSearchQuery("");
                setDesignationFilter("ALL");
                setStatusFilter("ALL");
              }}
            >
              <Filter className="size-3.5 mr-1.5 text-neutral-400" />
              Reset
            </Button>
          </div>
        </div>

        {/* Staff Table / Content */}
        {filteredStaff.length === 0 ? (
          <div className="py-16 px-4 text-center">
            <div className="mx-auto size-16 rounded-2xl bg-[#fef3ec] border border-[#fae2d3] flex items-center justify-center text-[#9a3412] mb-4">
              <Briefcase className="size-8 text-[#e8631b]" />
            </div>
            <h3 className="text-base font-bold text-neutral-900">No staff members found</h3>
            <p className="mt-1 text-xs text-neutral-500 max-w-sm mx-auto">
              {searchQuery || designationFilter !== "ALL" || statusFilter !== "ALL"
                ? "No members match your active filters. Try resetting the filters."
                : "You haven't added any staff members yet. Send an invitation to get started."}
            </p>
            <div className="mt-5 flex items-center justify-center gap-3">
              <Button
                onClick={() => setIsInviteModalOpen(true)}
                className="rounded-xl bg-[#e8631b] hover:bg-[#d45614] text-white"
              >
                <UserPlus className="size-4 mr-2" />
                Invite First Staff Member
              </Button>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#faf7f5] text-neutral-500 font-semibold border-b border-[#eddcd4]">
                <tr>
                  <th className="py-3.5 px-6">Member</th>
                  <th className="py-3.5 px-6">Contact Details</th>
                  <th className="py-3.5 px-6">Designation / Role</th>
                  <th className="py-3.5 px-6">Status</th>
                  <th className="py-3.5 px-6">Joined Date</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f3e6de] text-neutral-700">
                {filteredStaff.map((staff) => (
                  <tr key={staff.id} className="hover:bg-[#faf7f5]/70 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <Avatar className="size-9 border border-[#eddcd4]">
                          <AvatarFallback className="bg-[#fef3ec] text-[#9a3412] font-semibold text-xs">
                            {staff.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .toUpperCase()
                              .slice(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-bold text-neutral-900 leading-snug">{staff.name}</p>
                          <p className="text-[11px] text-neutral-400 font-mono">
                            {staff.employeeCode || staff.id}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <p className="font-medium text-neutral-900">{staff.email}</p>
                      <p className="text-[11px] text-neutral-400">{staff.phone}</p>
                    </td>
                    <td className="py-4 px-6">
                      <span className="inline-flex items-center rounded-lg bg-neutral-100 px-2.5 py-1 text-xs font-semibold text-neutral-700 border border-neutral-200">
                        {staff.designation}
                      </span>
                    </td>
                    <td className="py-4 px-6">{getStatusBadge(staff.status)}</td>
                    <td className="py-4 px-6 text-neutral-500 font-medium">
                      {new Date(staff.joinedDate).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          className="rounded-lg p-1.5 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors"
                          aria-label="Staff options"
                        >
                          <MoreVertical className="size-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Invite Modal */}
      <InviteStaffModal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        onSend={sendInvitation}
        isLoading={isSending}
      />
    </div>
  );
}
