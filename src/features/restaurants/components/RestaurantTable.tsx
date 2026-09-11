import { ArrowDown, ArrowUp, ArrowUpDown, Mail, Phone, Store, User } from "lucide-react";
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

function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return dateString;
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date);
  } catch {
    return dateString;
  }
}

function renderStatusBadge(status: RestaurantStatusType) {
  switch (status) {
    case RESTAURANT_STATUS.ACTIVE:
    case RESTAURANT_STATUS.APPROVED:
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100/70 text-emerald-800 border border-emerald-200/50">
          <span className="size-1.5 rounded-full bg-emerald-600" />
          {status}
        </span>
      );
    case RESTAURANT_STATUS.PENDING:
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100/70 text-amber-800 border border-amber-200/50">
          <span className="size-1.5 rounded-full bg-amber-600" />
          PENDING
        </span>
      );
    case RESTAURANT_STATUS.REJECTED:
    case RESTAURANT_STATUS.SUSPENDED:
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-100/70 text-rose-800 border border-rose-200/50">
          <span className="size-1.5 rounded-full bg-rose-600" />
          {status}
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-200/50">
          <span className="size-1.5 rounded-full bg-slate-500" />
          {status || "INACTIVE"}
        </span>
      );
  }
}

function renderPlanBadge(plan: RestaurantPlanType | string | null) {
  if (!plan) {
    return <span className="text-xs text-slate-400 font-medium">—</span>;
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
  const renderSortIcon = (field: RestaurantSortByType) => {
    if (sortBy !== field) {
      return (
        <ArrowUpDown className="size-3 text-slate-400 opacity-50 group-hover:opacity-100 transition-opacity" />
      );
    }
    return sortOrder === "desc" ? (
      <ArrowDown className="size-3.5 text-slate-800" />
    ) : (
      <ArrowUp className="size-3.5 text-slate-800" />
    );
  };

  return (
    <div className="w-full overflow-hidden" data-testid="restaurant-table">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead className="bg-[#f0edf1]/80 text-slate-600 font-bold border-b border-slate-200/80 uppercase tracking-wider select-none">
            <tr>
              {/* RESTAURANT NAME */}
              <th className="py-3.5 px-5">
                {onSort ? (
                  <button
                    type="button"
                    onClick={() => onSort("restaurant_name")}
                    className="inline-flex items-center gap-1.5 font-bold uppercase hover:text-slate-900 transition-colors group cursor-pointer"
                  >
                    <span>{RESTAURANT_MESSAGES.COL_RESTAURANT}</span>
                    {renderSortIcon("restaurant_name")}
                  </button>
                ) : (
                  <span>{RESTAURANT_MESSAGES.COL_RESTAURANT}</span>
                )}
              </th>

              {/* OWNER & CONTACT */}
              <th className="py-3.5 px-5">
                {onSort ? (
                  <button
                    type="button"
                    onClick={() => onSort("owner_name")}
                    className="inline-flex items-center gap-1.5 font-bold uppercase hover:text-slate-900 transition-colors group cursor-pointer"
                  >
                    <span>{RESTAURANT_MESSAGES.COL_OWNER}</span>
                    {renderSortIcon("owner_name")}
                  </button>
                ) : (
                  <span>{RESTAURANT_MESSAGES.COL_OWNER}</span>
                )}
              </th>

              {/* PLAN */}
              <th className="py-3.5 px-5">
                {onSort ? (
                  <button
                    type="button"
                    onClick={() => onSort("plan")}
                    className="inline-flex items-center gap-1.5 font-bold uppercase hover:text-slate-900 transition-colors group cursor-pointer"
                  >
                    <span>{RESTAURANT_MESSAGES.COL_PLAN}</span>
                    {renderSortIcon("plan")}
                  </button>
                ) : (
                  <span>{RESTAURANT_MESSAGES.COL_PLAN}</span>
                )}
              </th>

              {/* STATUS */}
              <th className="py-3.5 px-5">
                {onSort ? (
                  <button
                    type="button"
                    onClick={() => onSort("status")}
                    className="inline-flex items-center gap-1.5 font-bold uppercase hover:text-slate-900 transition-colors group cursor-pointer"
                  >
                    <span>{RESTAURANT_MESSAGES.COL_STATUS}</span>
                    {renderSortIcon("status")}
                  </button>
                ) : (
                  <span>{RESTAURANT_MESSAGES.COL_STATUS}</span>
                )}
              </th>

              {/* SUBSCRIPTION */}
              <th className="py-3.5 px-5">{RESTAURANT_MESSAGES.COL_SUBSCRIPTION}</th>

              {/* JOINED / CREATED AT */}
              <th className="py-3.5 px-5">
                {onSort ? (
                  <button
                    type="button"
                    onClick={() => onSort("created_at")}
                    className="inline-flex items-center gap-1.5 font-bold uppercase hover:text-slate-900 transition-colors group cursor-pointer"
                  >
                    <span>{RESTAURANT_MESSAGES.COL_JOINED}</span>
                    {renderSortIcon("created_at")}
                  </button>
                ) : (
                  <span>{RESTAURANT_MESSAGES.COL_JOINED}</span>
                )}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700 bg-white">
            {restaurants.map((restaurant) => {
              const email = restaurant.contact?.email || restaurant.contact?.owner_email || "—";
              const phone = restaurant.contact?.phone || null;

              return (
                <tr
                  key={restaurant.id}
                  className="hover:bg-slate-50/70 transition-colors"
                  data-testid={`restaurant-row-${restaurant.id}`}
                >
                  {/* RESTAURANT NAME & ID */}
                  <td className="py-4 px-5">
                    <div className="flex items-center gap-3">
                      <div className="size-9 shrink-0 flex items-center justify-center rounded-xl bg-amber-50 text-amber-600 border border-amber-200/60 shadow-2xs">
                        <Store className="size-4.5" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-slate-900 truncate">
                          {restaurant.restaurant_name}
                        </p>
                        <p className="text-[11px] text-slate-400 font-mono truncate">
                          ID: {restaurant.id.slice(0, 10)}...
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* OWNER & CONTACT */}
                  <td className="py-4 px-5">
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
                  </td>

                  {/* PLAN */}
                  <td className="py-4 px-5">{renderPlanBadge(restaurant.plan)}</td>

                  {/* STATUS */}
                  <td className="py-4 px-5">{renderStatusBadge(restaurant.status)}</td>

                  {/* SUBSCRIPTION */}
                  <td className="py-4 px-5">
                    {restaurant.is_subscription_active ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                        Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-500 border border-slate-200/60">
                        Inactive
                      </span>
                    )}
                  </td>

                  {/* CREATED AT */}
                  <td className="py-4 px-5 text-slate-500 text-[11px] font-medium whitespace-nowrap">
                    {formatDate(restaurant.created_at)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
