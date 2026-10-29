import { Eye } from "lucide-react";
import { useMemo } from "react";
import { Link } from "react-router-dom";
import { RESTAURANT_ROUTES } from "@/app/router/routes.constants";
import type { Column } from "@/components/common/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { formatDate } from "@/lib/utils/date";
import { RestaurantStaffStatusBadge } from "../components/RestaurantStaffStatusBadge";
import type { StaffMember } from "../types/staff-invitation.types";
import { getStaffInitials } from "../utils/staff.helpers";

export function useRestaurantStaffColumns(): Column<StaffMember>[] {
  return useMemo<Column<StaffMember>[]>(
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
        cell: ({ row: staff }) => <RestaurantStaffStatusBadge status={staff.status} />,
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
              to={RESTAURANT_ROUTES.STAFF.DETAIL(staff.id)}
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
    [],
  );
}
