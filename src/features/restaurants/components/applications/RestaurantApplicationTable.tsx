import {
  CheckCircle2,
  Clock,
  FileCheck2,
  Mail,
  MapPin,
  Phone,
  ShieldAlert,
  Store,
  User,
} from "lucide-react";
import { useMemo } from "react";
import { Link } from "react-router-dom";
import { type Column, DataTable } from "@/components/common/table";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils/date";
import {
  APPLICATION_MESSAGES,
  APPLICATION_STATUS,
} from "../../constants/restaurant-application.constants";
import type {
  ApplicationSortByType,
  ApplicationSortOrderType,
  RestaurantApplicationItem,
} from "../../types/restaurant-application.types";

export interface RestaurantApplicationTableProps {
  applications: RestaurantApplicationItem[];
  sortBy?: ApplicationSortByType;
  sortOrder?: ApplicationSortOrderType;
  onSort?: (field: ApplicationSortByType) => void;
}

function renderStatusBadge(status: string) {
  switch (status) {
    case APPLICATION_STATUS.PENDING:
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200 shadow-2xs">
          <Clock className="size-3.5 text-amber-600 shrink-0" />
          Pending Verification
        </span>
      );
    case APPLICATION_STATUS.REJECTED:
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-200 shadow-2xs">
          <ShieldAlert className="size-3.5 text-rose-600 shrink-0" />
          Rejected
        </span>
      );
    case APPLICATION_STATUS.APPROVED:
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 shadow-2xs">
          <CheckCircle2 className="size-3.5 text-emerald-600 shrink-0" />
          Approved
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">
          {status}
        </span>
      );
  }
}

export function RestaurantApplicationTable({
  applications,
  sortBy,
  sortOrder,
  onSort,
}: RestaurantApplicationTableProps) {
  const columns = useMemo<Column<RestaurantApplicationItem>[]>(
    () => [
      {
        key: "restaurant_name",
        sortKey: "restaurant_name",
        header: APPLICATION_MESSAGES.COL_RESTAURANT,
        sortable: Boolean(onSort),
        cell: ({ row: app }) => {
          const locationText = app.address
            ? `${app.address.city}, ${app.address.state}`
            : "Location not provided";

          return (
            <div className="flex items-start gap-3">
              <div className="size-9 shrink-0 flex items-center justify-center rounded-xl bg-orange-50 text-orange-600 border border-orange-200/60 shadow-2xs group-hover:scale-105 transition-transform mt-0.5">
                <Store className="size-4.5" />
              </div>
              <div className="min-w-0">
                <Link
                  to={`/admin/restaurants/onboarding/${app.id}`}
                  className="font-bold text-slate-900 hover:text-[#ff6b00] truncate transition-colors block"
                >
                  {app.restaurant_name}
                </Link>
                <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                  <MapPin className="size-3 text-slate-400 shrink-0" />
                  <span className="truncate">{locationText}</span>
                </p>
              </div>
            </div>
          );
        },
      },
      {
        key: "owner_name",
        sortKey: "owner_name",
        header: APPLICATION_MESSAGES.COL_OWNER,
        sortable: Boolean(onSort),
        cell: ({ row: app }) => {
          const email = app.email || app.owner_email || "—";
          const phone = app.phone || null;

          return (
            <div className="min-w-0 space-y-0.5">
              <p className="font-semibold text-slate-900 flex items-center gap-1.5">
                <User className="size-3 text-slate-400" />
                <span className="truncate">{app.owner_name}</span>
              </p>
              <p className="text-[11px] text-slate-500 flex items-center gap-1.5">
                <Mail className="size-3 text-slate-400 shrink-0" />
                <span className="truncate">{email}</span>
              </p>
              {phone && (
                <p className="text-[11px] text-slate-500 flex items-center gap-1.5">
                  <Phone className="size-3 text-slate-400 shrink-0" />
                  <span>{phone}</span>
                </p>
              )}
            </div>
          );
        },
      },
      {
        key: "documents",
        header: APPLICATION_MESSAGES.COL_DOCUMENTS,
        cell: ({ row: app }) => {
          const docCount = app.documents?.length ?? 0;
          return (
            <Badge
              variant="outline"
              className="gap-1.5 bg-slate-50 text-slate-700 border-slate-200 text-xs font-semibold"
            >
              <FileCheck2 className="size-3.5 text-slate-500" />
              <span>
                {docCount} Document{docCount === 1 ? "" : "s"}
              </span>
            </Badge>
          );
        },
      },
      {
        key: "status",
        sortKey: "status",
        header: APPLICATION_MESSAGES.COL_STATUS,
        sortable: Boolean(onSort),
        cell: ({ row: app }) => renderStatusBadge(app.status),
      },
      {
        key: "created_at",
        sortKey: "created_at",
        header: APPLICATION_MESSAGES.COL_SUBMITTED,
        sortable: Boolean(onSort),
        cell: ({ row: app }) => (
          <span className="text-slate-500 text-[11px] font-medium whitespace-nowrap">
            {formatDate(app.created_at)}
          </span>
        ),
      },
      {
        key: "actions",
        header: APPLICATION_MESSAGES.COL_ACTIONS,
        align: "right",
        cell: ({ row: app }) => (
          <Link
            to={`/admin/restaurants/onboarding/${app.id}`}
            className="inline-flex items-center justify-center px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-[#ff6b00] hover:bg-[#e05e00] transition-all shadow-2xs hover:shadow-xs cursor-pointer"
            data-testid={`review-application-btn-${app.id}`}
          >
            Review Application
          </Link>
        ),
      },
    ],
    [onSort],
  );

  return (
    <DataTable
      data={applications}
      columns={columns}
      sortBy={sortBy}
      sortOrder={sortOrder}
      onSort={onSort ? (field) => onSort(field as ApplicationSortByType) : undefined}
      getRowId={(app) => app.id}
      getRowTestId={(app) => `application-row-${app.id}`}
      testId="restaurant-application-table"
      theme="restaurant"
      headerClassName="border-b border-slate-200 bg-slate-50/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider"
    />
  );
}

export default RestaurantApplicationTable;
