import {
  ArrowDown,
  ArrowUp,
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
import { Link } from "react-router-dom";
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

export function RestaurantApplicationTable({
  applications,
  sortBy,
  sortOrder,
  onSort,
}: RestaurantApplicationTableProps) {
  const renderSortIcon = (field: ApplicationSortByType) => {
    if (sortBy !== field) return null;
    return sortOrder === "asc" ? (
      <ArrowUp className="size-3 text-[#ff6b00]" />
    ) : (
      <ArrowDown className="size-3 text-[#ff6b00]" />
    );
  };

  const renderStatusBadge = (status: string) => {
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
  };

  return (
    <div className="w-full overflow-hidden" data-testid="restaurant-application-table">
      <div className="overflow-x-auto scrollbar-thin">
        <table className="w-full text-left border-collapse text-xs sm:text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider select-none">
              {/* RESTAURANT NAME */}
              <th className="py-3.5 px-5">
                {onSort ? (
                  <button
                    type="button"
                    onClick={() => onSort("restaurant_name")}
                    className="inline-flex items-center gap-1.5 font-bold uppercase hover:text-slate-900 transition-colors group cursor-pointer"
                  >
                    <span>{APPLICATION_MESSAGES.COL_RESTAURANT}</span>
                    {renderSortIcon("restaurant_name")}
                  </button>
                ) : (
                  <span>{APPLICATION_MESSAGES.COL_RESTAURANT}</span>
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
                    <span>{APPLICATION_MESSAGES.COL_OWNER}</span>
                    {renderSortIcon("owner_name")}
                  </button>
                ) : (
                  <span>{APPLICATION_MESSAGES.COL_OWNER}</span>
                )}
              </th>

              {/* DOCUMENTS */}
              <th className="py-3.5 px-5">{APPLICATION_MESSAGES.COL_DOCUMENTS}</th>

              {/* STATUS */}
              <th className="py-3.5 px-5">
                {onSort ? (
                  <button
                    type="button"
                    onClick={() => onSort("status")}
                    className="inline-flex items-center gap-1.5 font-bold uppercase hover:text-slate-900 transition-colors group cursor-pointer"
                  >
                    <span>{APPLICATION_MESSAGES.COL_STATUS}</span>
                    {renderSortIcon("status")}
                  </button>
                ) : (
                  <span>{APPLICATION_MESSAGES.COL_STATUS}</span>
                )}
              </th>

              {/* SUBMITTED DATE */}
              <th className="py-3.5 px-5">
                {onSort ? (
                  <button
                    type="button"
                    onClick={() => onSort("created_at")}
                    className="inline-flex items-center gap-1.5 font-bold uppercase hover:text-slate-900 transition-colors group cursor-pointer"
                  >
                    <span>{APPLICATION_MESSAGES.COL_SUBMITTED}</span>
                    {renderSortIcon("created_at")}
                  </button>
                ) : (
                  <span>{APPLICATION_MESSAGES.COL_SUBMITTED}</span>
                )}
              </th>

              {/* ACTIONS */}
              <th className="py-3.5 px-5 text-right font-bold uppercase">
                {APPLICATION_MESSAGES.COL_ACTIONS}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700 bg-white">
            {applications.map((app) => {
              const email = app.email || app.owner_email || "—";
              const phone = app.phone || null;
              const locationText = app.address
                ? `${app.address.city}, ${app.address.state}`
                : "Location not provided";
              const docCount = app.documents?.length ?? 0;

              return (
                <tr
                  key={app.id}
                  className="hover:bg-slate-50/70 transition-colors group"
                  data-testid={`application-row-${app.id}`}
                >
                  {/* RESTAURANT NAME & LOCATION */}
                  <td className="py-4 px-5">
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
                  </td>

                  {/* OWNER & CONTACT */}
                  <td className="py-4 px-5">
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
                  </td>

                  {/* DOCUMENTS COUNT */}
                  <td className="py-4 px-5">
                    <Badge
                      variant="outline"
                      className="gap-1.5 bg-slate-50 text-slate-700 border-slate-200 text-xs font-semibold"
                    >
                      <FileCheck2 className="size-3.5 text-slate-500" />
                      <span>
                        {docCount} Document{docCount === 1 ? "" : "s"}
                      </span>
                    </Badge>
                  </td>

                  {/* STATUS */}
                  <td className="py-4 px-5">{renderStatusBadge(app.status)}</td>

                  {/* SUBMITTED DATE */}
                  <td className="py-4 px-5 text-slate-500 text-[11px] font-medium whitespace-nowrap">
                    {formatDate(app.created_at)}
                  </td>

                  {/* ACTIONS */}
                  <td className="py-4 px-5 text-right whitespace-nowrap">
                    <Link
                      to={`/admin/restaurants/onboarding/${app.id}`}
                      className="inline-flex items-center justify-center px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-[#ff6b00] hover:bg-[#e05e00] transition-all shadow-2xs hover:shadow-xs cursor-pointer"
                      data-testid={`review-application-btn-${app.id}`}
                    >
                      Review Application
                    </Link>
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
