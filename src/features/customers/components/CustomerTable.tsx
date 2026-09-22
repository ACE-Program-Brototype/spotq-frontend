import { Ban, CheckCircle2, Eye, Loader2 } from "lucide-react";
import { useMemo } from "react";
import { type Column, DataTable } from "@/components/common/table";
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
  onViewDetails?: (customer: Customer) => void;
  isActionLoading?: boolean;
  actionTargetId?: string | null;
}

export function CustomerTable({
  customers,
  sortOrder = "DESC",
  onToggleSort,
  onStatusAction,
  onViewDetails,
  isActionLoading = false,
  actionTargetId = null,
}: CustomerTableProps) {
  const columns = useMemo<Column<Customer>[]>(
    () => [
      {
        key: "user_profile",
        header: CUSTOMER_MESSAGES.COL_USER_PROFILE,
        sortable: Boolean(onToggleSort),
        cell: ({ row: customer }) => (
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
        ),
      },
      {
        key: "contact_info",
        header: CUSTOMER_MESSAGES.COL_CONTACT_INFO,
        cell: ({ row: customer }) => (
          <div>
            <p className="font-medium text-slate-900 truncate">{customer.email}</p>
            <p className="text-[11px] text-slate-500 font-medium mt-0.5">
              {customer.phone || CUSTOMER_MESSAGES.LOCATION_NOT_AVAILABLE}
            </p>
          </div>
        ),
      },
      {
        key: "status",
        header: CUSTOMER_MESSAGES.COL_STATUS,
        cell: ({ row: customer }) => {
          if (customer.status === CUSTOMER_STATUS.ACTIVE) {
            return (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100/70 text-emerald-800">
                <span className="size-1.5 rounded-full bg-emerald-600" />
                ACTIVE
              </span>
            );
          }
          if (customer.status === CUSTOMER_STATUS.BLOCKED) {
            return (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-100/70 text-rose-800">
                <span className="size-1.5 rounded-full bg-rose-600" />
                BLOCKED
              </span>
            );
          }
          return (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700">
              <span className="size-1.5 rounded-full bg-slate-500" />
              INACTIVE
            </span>
          );
        },
      },
      {
        key: "actions",
        header: CUSTOMER_MESSAGES.COL_ACTIONS,
        align: "right",
        cell: ({ row: customer }) => {
          const isBlocked = customer.status === CUSTOMER_STATUS.BLOCKED;
          const isCurrentRowLoading = isActionLoading && actionTargetId === customer.id;

          return (
            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => onViewDetails?.(customer)}
                title={CUSTOMER_MESSAGES.DETAILS_ACTION_TOOLTIP}
                aria-label={`${CUSTOMER_MESSAGES.DETAILS_ACTION_TOOLTIP} for ${customer.fullName}`}
                className="inline-flex size-8 items-center justify-center rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900 transition-colors"
                data-testid={`customer-details-btn-${customer.id}`}
              >
                <Eye className="size-4" />
              </button>
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
            </div>
          );
        },
      },
    ],
    [onToggleSort, isActionLoading, actionTargetId, onStatusAction, onViewDetails],
  );

  return (
    <DataTable
      data={customers}
      columns={columns}
      sortBy={onToggleSort ? "user_profile" : null}
      sortOrder={sortOrder === "DESC" ? "desc" : "asc"}
      onSort={() => onToggleSort?.()}
      getRowId={(customer) => customer.id}
      getRowTestId={(customer) => `customer-row-${customer.id}`}
      testId="customer-table"
      theme="admin"
      headerClassName="bg-[#f0edf1]/80 text-slate-600"
    />
  );
}

export default CustomerTable;
