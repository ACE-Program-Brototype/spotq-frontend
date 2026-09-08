import {
  Briefcase,
  ChevronDown,
  Download,
  Filter,
  Mail,
  MoreVertical,
  Plus,
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
import { InviteStaffModal } from "@/features/auth/components/InviteStaffModal";
import { useDebounce } from "@/features/auth/hooks/use-debounce";
import { useStaffInvitations } from "@/features/auth/hooks/use-staff-invitations";
import type { StaffMember } from "@/features/auth/types/staff-invitation.types";

export default function RestaurantStaffPage() {
  const [staffList] = useState<StaffMember[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebounce(searchQuery, 300);
  const [designationFilter, setDesignationFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

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

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="space-y-6 max-w-full pb-12">
      {/* Breadcrumbs & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-medium text-neutral-500 mb-1">
            <Link to="/restaurant/dashboard" className="hover:text-neutral-900 transition-colors">
              Home
            </Link>
            <span>/</span>
            <span className="text-[#9a3412] font-semibold">Staff</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900">Staff</h1>
          <p className="mt-1 text-xs sm:text-sm text-neutral-500">
            Manage restaurant employees who have access to the SpotQ platform.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <Link
            to="/restaurant/staff/invitations"
            className="inline-flex items-center gap-2 rounded-xl border border-[#eddcd4] bg-white px-3.5 py-2 text-xs font-semibold text-[#9a3412] hover:bg-[#fef3ec] transition-colors shadow-2xs"
          >
            <Mail className="size-3.5 text-[#e8631b]" />
            <span>Invitations</span>
            {invitationStats.pending > 0 && (
              <span className="ml-0.5 rounded-full bg-[#e8631b] px-1.5 py-0.2 text-[10px] font-bold text-white">
                {invitationStats.pending}
              </span>
            )}
          </Link>

          <Button
            variant="outline"
            className="rounded-xl border-[#eddcd4] bg-white text-xs font-semibold text-neutral-700 hover:bg-[#faf7f5] shadow-2xs"
            onClick={() => {
              // Export handler
              const csvContent =
                "data:text/csv;charset=utf-8," +
                ["ID,Name,Email,Phone,Designation,Status,JoinedDate"]
                  .concat(
                    staffList.map(
                      (s) =>
                        `${s.id},${s.name},${s.email},${s.phone},${s.designation},${s.status},${s.joinedDate}`,
                    ),
                  )
                  .join("\n");
              const encodedUri = encodeURI(csvContent);
              const link = document.createElement("a");
              link.setAttribute("href", encodedUri);
              link.setAttribute("download", "spotq_staff_list.csv");
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            }}
          >
            <Download className="size-3.5 mr-1.5 text-neutral-500" />
            Export Staff
          </Button>

          <Button
            onClick={() => setIsInviteModalOpen(true)}
            className="rounded-xl bg-[#e8631b] hover:bg-[#d45614] text-white shadow-xs text-xs font-semibold px-4"
          >
            <Plus className="size-4 mr-1" />
            Add Staff
          </Button>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Total Staff */}
        <div className="rounded-2xl border border-[#eddcd4] bg-white p-4.5 shadow-2xs">
          <div className="flex items-center justify-between">
            <div className="size-9 rounded-xl bg-[#fef3ec] flex items-center justify-center text-[#9a3412] border border-[#fae2d3]">
              <Briefcase className="size-4.5 text-[#e8631b]" />
            </div>
            <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              Total
            </span>
          </div>
          <div className="mt-3">
            <p className="text-2xl font-bold text-neutral-900">{totalStaff}</p>
            <p className="text-xs font-medium text-neutral-500">Total Staff</p>
          </div>
        </div>

        {/* Active Staff */}
        <div className="rounded-2xl border border-[#eddcd4] bg-white p-4.5 shadow-2xs">
          <div className="flex items-center justify-between">
            <div className="size-9 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 border border-emerald-200">
              <UserCheck className="size-4.5" />
            </div>
            <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              Active
            </span>
          </div>
          <div className="mt-3">
            <p className="text-2xl font-bold text-neutral-900">{activeStaff}</p>
            <p className="text-xs font-medium text-neutral-500">Active Staff</p>
          </div>
        </div>

        {/* Inactive Staff */}
        <div className="rounded-2xl border border-[#eddcd4] bg-white p-4.5 shadow-2xs">
          <div className="flex items-center justify-between">
            <div className="size-9 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 border border-amber-200">
              <UserX className="size-4.5" />
            </div>
            <span className="text-[11px] font-medium text-neutral-500">Inactive</span>
          </div>
          <div className="mt-3">
            <p className="text-2xl font-bold text-neutral-900">{inactiveStaff}</p>
            <p className="text-xs font-medium text-neutral-500">Inactive Staff</p>
          </div>
        </div>

        {/* Pending Invitations */}
        <div className="rounded-2xl border border-[#eddcd4] bg-white p-4.5 shadow-2xs">
          <div className="flex items-center justify-between">
            <div className="size-9 rounded-xl bg-[#fef3ec] flex items-center justify-center text-[#9a3412] border border-[#fae2d3]">
              <UserPlus className="size-4.5 text-[#e8631b]" />
            </div>
            <span className="text-[11px] font-semibold text-[#9a3412] bg-[#fef3ec] px-2 py-0.5 rounded-full border border-[#fae2d3]">
              Pending
            </span>
          </div>
          <div className="mt-3">
            <p className="text-2xl font-bold text-neutral-900">{invitationStats.pending}</p>
            <p className="text-xs font-medium text-neutral-500">Pending Invitations</p>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 rounded-2xl border border-[#eddcd4] bg-white p-3 shadow-2xs">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-neutral-400" />
          <Input
            type="text"
            placeholder="Search by name, email, or mobile..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-9.5 rounded-xl border-[#eddcd4] bg-[#faf7f5]/40 text-xs focus:border-[#e8631b]"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto">
          {/* Designation Dropdown */}
          <div className="relative">
            <select
              value={designationFilter}
              onChange={(e) => setDesignationFilter(e.target.value)}
              className="h-9.5 appearance-none rounded-xl border border-[#eddcd4] bg-[#faf7f5]/40 pl-3 pr-8 text-xs font-medium text-neutral-700 focus:border-[#e8631b] focus:outline-none"
            >
              <option value="ALL">All Designations</option>
              {availableDesignations.map((desig) => (
                <option key={desig} value={desig}>
                  {desig}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 size-3.5 text-neutral-400" />
          </div>

          {/* Status Dropdown */}
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-9.5 appearance-none rounded-xl border border-[#eddcd4] bg-[#faf7f5]/40 pl-3 pr-8 text-xs font-medium text-neutral-700 focus:border-[#e8631b] focus:outline-none"
            >
              <option value="ALL">Status</option>
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 size-3.5 text-neutral-400" />
          </div>

          <button
            type="button"
            className="h-9.5 w-9.5 rounded-xl border border-[#eddcd4] bg-[#faf7f5]/40 flex items-center justify-center text-neutral-600 hover:text-neutral-900 transition-colors"
            title="Additional Filters"
            aria-label="Additional Filters"
          >
            <Filter className="size-3.5" />
          </button>

          <div className="hidden sm:block h-6 w-[1px] bg-[#eddcd4]" />

          <div className="relative hidden sm:block">
            <select className="h-9.5 appearance-none rounded-xl border border-transparent bg-transparent pl-2 pr-7 text-xs font-semibold text-neutral-700 hover:text-neutral-900 focus:outline-none cursor-pointer">
              <option>Sort: Date Added</option>
              <option>Sort: Name (A-Z)</option>
              <option>Sort: Last Active</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-1.5 top-1/2 -translate-y-1/2 size-3.5 text-neutral-400" />
          </div>
        </div>
      </div>

      {/* Staff Table */}
      <div className="rounded-2xl border border-[#eddcd4] bg-white shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#eddcd4] bg-[#fffaf6] text-neutral-600 font-semibold">
                <th className="py-3.5 px-4">Employee</th>
                <th className="py-3.5 px-4">Designation</th>
                <th className="py-3.5 px-4">Contact</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Last Login</th>
                <th className="py-3.5 px-4">Joined Date</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f3e6de]">
              {filteredStaff.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-neutral-400">
                    <Briefcase className="size-8 mx-auto text-neutral-300 mb-2" />
                    <p className="font-semibold text-neutral-700">No staff members found</p>
                    <p className="text-xs text-neutral-400 mt-0.5">
                      Try adjusting your search criteria.
                    </p>
                  </td>
                </tr>
              ) : (
                filteredStaff.map((staff) => (
                  <tr
                    key={staff.id}
                    className="hover:bg-[#faf7f5]/50 transition-colors group select-none"
                  >
                    {/* Employee avatar + name + ID */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="size-9 rounded-full bg-[#fef3ec] text-[#9a3412] font-bold border border-[#fae2d3] shrink-0">
                          <AvatarFallback className="bg-[#fef3ec] text-[#9a3412] text-xs font-bold rounded-full">
                            {getInitials(staff.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-bold text-neutral-900 text-xs">{staff.name}</p>
                          <p className="text-[11px] font-medium text-neutral-400">ID: {staff.id}</p>
                        </div>
                      </div>
                    </td>

                    {/* Designation Pill */}
                    <td className="py-3.5 px-4">
                      <span className="inline-block rounded-full bg-[#f5e9e2] px-3 py-1 text-[11px] font-medium text-neutral-800">
                        {staff.designation}
                      </span>
                    </td>

                    {/* Contact */}
                    <td className="py-3.5 px-4">
                      <p className="font-medium text-neutral-900 text-xs">{staff.phone}</p>
                      <p className="text-[11px] text-neutral-400">{staff.email}</p>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5 font-medium text-xs">
                        {staff.status === "ACTIVE" ? (
                          <>
                            <span className="size-2 rounded-full bg-emerald-500" />
                            <span className="text-emerald-700 font-semibold">Active</span>
                          </>
                        ) : (
                          <>
                            <span className="size-2 rounded-full bg-neutral-400" />
                            <span className="text-neutral-500">Inactive</span>
                          </>
                        )}
                      </div>
                    </td>

                    {/* Last Login */}
                    <td className="py-3.5 px-4 text-neutral-600 font-medium">{staff.lastLogin}</td>

                    {/* Joined Date */}
                    <td className="py-3.5 px-4 text-neutral-600 font-medium">{staff.joinedDate}</td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <button
                        type="button"
                        className="rounded-lg p-1 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors"
                        aria-label="Staff actions"
                      >
                        <MoreVertical className="size-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-[#eddcd4] bg-[#faf7f5]/30 text-xs text-neutral-600">
          <p className="text-xs text-neutral-500">
            {filteredStaff.length === 0
              ? "0 staff members"
              : `Showing 1-${filteredStaff.length} of ${staffList.length} staff members`}
          </p>

          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="size-7 rounded-lg border border-[#eddcd4] bg-white flex items-center justify-center text-neutral-600 hover:bg-[#faf7f5] disabled:opacity-40 disabled:pointer-events-none transition-colors"
            >
              &lt;
            </button>

            <button
              type="button"
              onClick={() => setCurrentPage(1)}
              className="size-7 rounded-lg text-xs font-semibold bg-[#e8631b] text-white shadow-2xs"
            >
              1
            </button>

            <button
              type="button"
              disabled={true}
              onClick={() => setCurrentPage((p) => p + 1)}
              className="size-7 rounded-lg border border-[#eddcd4] bg-white flex items-center justify-center text-neutral-600 hover:bg-[#faf7f5] disabled:opacity-40 disabled:pointer-events-none transition-colors"
            >
              &gt;
            </button>
          </div>
        </div>
      </div>

      {/* Invite Staff Modal */}
      <InviteStaffModal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        onSend={sendInvitation}
        isLoading={isSending}
      />
    </div>
  );
}
