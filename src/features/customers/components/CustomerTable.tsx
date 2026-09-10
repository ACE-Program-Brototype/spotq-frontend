import { ArrowDown, ArrowUp, Ban, CheckCircle2, Loader2, MapPin } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  CUSTOMER_MESSAGES,
  CUSTOMER_STATUS,
  type CustomerSortOrderType,
  type CustomerStatusType,
} from "../constants/customer.constants";
import type { Customer } from "../types/customer.types";
import { formatMemberSince, getCustomerInitials } from "../utils/customer.utils";

export interface CustomerTableProps {
  customers: Customer[];
  sortOrder?: CustomerSortOrderType;
  onToggleSort?: () => void;
  onStatusAction?: (customer: Customer, nextStatus: CustomerStatusType) => void;
  isActionLoading?: boolean;
  actionTargetId?: string | null;
}

export function CustomerTable({
  customers,
  sortOrder = "DESC",
  onToggleSort,
  onStatusAction,
  isActionLoading = false,
  actionTargetId = null,
}: CustomerTableProps) {
  return (
    <div className="w-full overflow-hidden" data-testid="customer-table">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#f0edf1]/80 text-slate-600 font-bold border-b border-slate-200/80 uppercase tracking-wider">
            <tr>
              <th className="py-3.5 px-6">
                {onToggleSort ? (
                  <button
                    type="button"
                    onClick={onToggleSort}
                    title={CUSTOMER_MESSAGES.SORT_BY_MEMBER_SINCE}
                    className="inline-flex items-center gap-1.5 font-bold uppercase hover:text-slate-900 transition-colors group cursor-pointer"
                  >
                    <span>{CUSTOMER_MESSAGES.COL_USER_PROFILE}</span>
                    {sortOrder === "DESC" ? (
                      <ArrowDown className="size-3.5 text-slate-700 group-hover:text-slate-900 transition-transform" />
                    ) : (
                      <ArrowUp className="size-3.5 text-slate-700 group-hover:text-slate-900 transition-transform" />
                    )}
                  </button>
                ) : (
                  <span>{CUSTOMER_MESSAGES.COL_USER_PROFILE}</span>
                )}
              </th>
              <th className="py-3.5 px-6">{CUSTOMER_MESSAGES.COL_CONTACT_INFO}</th>
              <th className="py-3.5 px-6">{CUSTOMER_MESSAGES.COL_LOCATION}</th>
              <th className="py-3.5 px-6">{CUSTOMER_MESSAGES.COL_STATUS}</th>
              <th className="py-3.5 px-6 text-right">{CUSTOMER_MESSAGES.COL_ACTIONS}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700 bg-white">
            {customers.map((customer) => {
              const isBlocked = customer.status === CUSTOMER_STATUS.BLOCKED;
              const isCurrentRowLoading = isActionLoading && actionTargetId === customer.id;

              return (
                <tr
                  key={customer.id}
                  className="hover:bg-slate-50/70 transition-colors"
                  data-testid={`customer-row-${customer.id}`}
                >
                  {/* USER PROFILE */}
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <Avatar className="size-10 shrink-0 bg-slate-100 border border-slate-200/60 shadow-2xs">
                        {customer.avatarUrl && (
                          <AvatarImage src={customer.avatarUrl} alt={customer.fullName} />
                        )}
                        <AvatarFallback className="bg-slate-200 text-slate-700 font-semibold text-xs">
                          {getCustomerInitials(customer.fullName)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <p className="font-bold text-slate-900 truncate">{customer.fullName}</p>
                        <p className="text-[11px] text-slate-400 font-medium">
                          {formatMemberSince(customer.createdAt)}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* CONTACT INFO */}
                  <td className="py-4 px-6">
                    <div>
                      <p className="font-medium text-slate-900 truncate">{customer.email}</p>
                      <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                        {customer.phone || CUSTOMER_MESSAGES.LOCATION_NOT_AVAILABLE}
                      </p>
                    </div>
                  </td>

                  {/* LOCATION */}
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-1.5 text-slate-600 font-medium">
                      <MapPin className="size-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">
                        {customer.location || CUSTOMER_MESSAGES.LOCATION_NOT_AVAILABLE}
                      </span>
                    </div>
                  </td>

                  {/* STATUS */}
                  <td className="py-4 px-6">
                    {customer.status === CUSTOMER_STATUS.ACTIVE ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100/70 text-emerald-800">
                        <span className="size-1.5 rounded-full bg-emerald-600" />
                        ACTIVE
                      </span>
                    ) : customer.status === CUSTOMER_STATUS.BLOCKED ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-100/70 text-rose-800">
                        <span className="size-1.5 rounded-full bg-rose-600" />
                        BLOCKED
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700">
                        <span className="size-1.5 rounded-full bg-slate-500" />
                        INACTIVE
                      </span>
                    )}
                  </td>

                  {/* ACTIONS */}
                  <td className="py-4 px-6 text-right">
                    {isBlocked ? (
                      <button
                        type="button"
                        onClick={() => onStatusAction?.(customer, CUSTOMER_STATUS.ACTIVE)}
                        disabled={isActionLoading}
                        title={CUSTOMER_MESSAGES.UNBLOCK_ACTION_TOOLTIP}
                        aria-label={`${CUSTOMER_MESSAGES.UNBLOCK_ACTION_TOOLTIP} for ${customer.fullName}`}
                        className="inline-flex size-8 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-colors disabled:opacity-50"
                      >
                        {isCurrentRowLoading ? (
                          <Loader2 className="size-4 animate-spin text-emerald-600" />
                        ) : (
                          <CheckCircle2 className="size-4" />
                        )}
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => onStatusAction?.(customer, CUSTOMER_STATUS.BLOCKED)}
                        disabled={isActionLoading}
                        title={CUSTOMER_MESSAGES.BLOCK_ACTION_TOOLTIP}
                        aria-label={`${CUSTOMER_MESSAGES.BLOCK_ACTION_TOOLTIP} for ${customer.fullName}`}
                        className="inline-flex size-8 items-center justify-center rounded-full bg-rose-50 text-rose-500 hover:bg-rose-100 transition-colors disabled:opacity-50"
                      >
                        {isCurrentRowLoading ? (
                          <Loader2 className="size-4 animate-spin text-rose-500" />
                        ) : (
                          <Ban className="size-4" />
                        )}
                      </button>
                    )}
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

export default CustomerTable;
