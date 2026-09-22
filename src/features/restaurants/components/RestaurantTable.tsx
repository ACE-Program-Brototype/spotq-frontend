import { Eye, Mail, Phone, Store, User } from "lucide-react";
import { useMemo } from "react";
import { Link } from "react-router-dom";
import { type Column, DataTable } from "@/components/common/table";
import { formatDate } from "@/lib/utils/date";
import {
  RESTAURANT_MESSAGES,
  RESTAURANT_PLANS,
  RESTAURANT_STATUS,
} from "../constants/restaurant.constants";
import type {
  RestaurantListItem,
  RestaurantPlanType,
  RestaurantSortByType,
  RestaurantSortOrderType,
  RestaurantStatusType,
} from "../types/restaurant.types";

export interface RestaurantTableProps {
  restaurants: RestaurantListItem[];
  sortBy?: RestaurantSortByType;
  sortOrder?: RestaurantSortOrderType;
  onSort?: (field: RestaurantSortByType) => void;
}

function renderStatusBadge(status: RestaurantStatusType | string | null | undefined) {
  const normalized = status ? status.toUpperCase() : "";
  switch (normalized) {
    case RESTAURANT_STATUS.ACTIVE:
    case RESTAURANT_STATUS.APPROVED:
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100/70 text-emerald-800 border border-emerald-200/50">
          <span className="size-1.5 rounded-full bg-emerald-600" />
          {normalized}
        </span>
      );
    case RESTAURANT_STATUS.PENDING:
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100/70 text-amber-800 border border-amber-200/50">
          <span className="size-1.5 rounded-full bg-amber-600" />
          {normalized}
        </span>
      );
    case RESTAURANT_STATUS.REJECTED:
    case RESTAURANT_STATUS.SUSPENDED:
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-100/70 text-rose-800 border border-rose-200/50">
          <span className="size-1.5 rounded-full bg-rose-600" />
          {normalized}
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-200/50">
          <span className="size-1.5 rounded-full bg-slate-500" />
          {normalized || "INACTIVE"}
        </span>
      );
  }
}

function renderPlanBadge(plan: RestaurantPlanType | string | null) {
  if (!plan) {
    return <span className="text-xs text-slate-400 font-medium">-</span>;
  }

  const normalized = plan.toUpperCase();
  if (normalized === RESTAURANT_PLANS.QUEUE_PRO) {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200/60">
        Queue Pro
      </span>
    );
  }
  if (normalized === RESTAURANT_PLANS.SELF_SERVICE_PRO) {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-bold bg-purple-50 text-purple-700 border border-purple-200/60">
        Self Service Pro
      </span>
    );
  }
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-bold bg-sky-50 text-sky-700 border border-sky-200/60">
      {normalized.replace(/_/g, " ")}
    </span>
  );
}

export function RestaurantTable({
  restaurants,
  sortBy = "created_at",
  sortOrder = "desc",
  onSort,
}: RestaurantTableProps) {
  const columns = useMemo<Column<RestaurantListItem>[]>(
    () => [
      {
        key: "restaurant_name",
        sortKey: "restaurant_name",
        header: RESTAURANT_MESSAGES.COL_RESTAURANT,
        sortable: Boolean(onSort),
        cell: ({ row: restaurant }) => (
          <div className="flex items-center gap-3">
            <div className="size-9 shrink-0 flex items-center justify-center rounded-xl bg-amber-50 text-amber-600 border border-amber-200/60 shadow-2xs group-hover:scale-105 transition-transform">
              <Store className="size-4.5" />
            </div>
            <div className="min-w-0">
              <Link
                to={`/admin/restaurants/${restaurant.id}`}
                className="font-bold text-slate-900 hover:text-amber-600 truncate transition-colors block"
              >
                {restaurant.restaurant_name}
              </Link>
              <p className="text-[11px] text-slate-400 font-mono truncate">
                ID: {restaurant.id.length > 10 ? `${restaurant.id.slice(0, 10)}...` : restaurant.id}
              </p>
            </div>
          </div>
        ),
      },
      {
        key: "owner_name",
        sortKey: "owner_name",
        header: RESTAURANT_MESSAGES.COL_OWNER,
        sortable: Boolean(onSort),
        cell: ({ row: restaurant }) => {
          const email = restaurant.contact?.email || restaurant.contact?.owner_email || "-";
          const phone = restaurant.contact?.phone || null;

          return (
            <div className="min-w-0 space-y-0.5">
              <p className="font-semibold text-slate-900 flex items-center gap-1.5">
                <User className="size-3 text-slate-400" />
                <span className="truncate">{restaurant.owner_name}</span>
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
        key: "plan",
        sortKey: "plan",
        header: RESTAURANT_MESSAGES.COL_PLAN,
        sortable: Boolean(onSort),
        cell: ({ row: restaurant }) => renderPlanBadge(restaurant.plan),
      },
      {
        key: "status",
        sortKey: "status",
        header: RESTAURANT_MESSAGES.COL_STATUS,
        sortable: Boolean(onSort),
        cell: ({ row: restaurant }) => renderStatusBadge(restaurant.status),
      },
      {
        key: "subscription",
        header: RESTAURANT_MESSAGES.COL_SUBSCRIPTION,
        cell: ({ row: restaurant }) =>
          restaurant.is_subscription_active ? (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
              Active
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-500 border border-slate-200/60">
              Inactive
            </span>
          ),
      },
      {
        key: "created_at",
        sortKey: "created_at",
        header: RESTAURANT_MESSAGES.COL_JOINED,
        sortable: Boolean(onSort),
        cell: ({ row: restaurant }) => (
          <span className="text-slate-500 text-[11px] font-medium whitespace-nowrap">
            {formatDate(restaurant.created_at)}
          </span>
        ),
      },
      {
        key: "actions",
        header: RESTAURANT_MESSAGES.COL_ACTIONS,
        align: "right",
        cell: ({ row: restaurant }) => (
          <Link
            to={`/admin/restaurants/${restaurant.id}`}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 hover:text-[#0052cc] hover:border-[#0052cc]/30 border border-slate-200/80 rounded-xl transition-all shadow-2xs group"
            data-testid={`restaurant-details-btn-${restaurant.id}`}
            aria-label={`View details for ${restaurant.restaurant_name}`}
          >
            <Eye className="size-3.5 text-slate-400 group-hover:text-[#0052cc] transition-colors" />
            <span>{RESTAURANT_MESSAGES.ACTION_DETAILS}</span>
          </Link>
        ),
      },
    ],
    [onSort],
  );

  return (
    <DataTable
      data={restaurants}
      columns={columns}
      sortBy={sortBy}
      sortOrder={sortOrder}
      onSort={onSort ? (key) => onSort(key as RestaurantSortByType) : undefined}
      getRowId={(restaurant) => restaurant.id}
      getRowTestId={(restaurant) => `restaurant-row-${restaurant.id}`}
      testId="restaurant-table"
      theme="admin"
      headerClassName="bg-[#f0edf1]/80 text-slate-600"
    />
  );
}

export default RestaurantTable;
