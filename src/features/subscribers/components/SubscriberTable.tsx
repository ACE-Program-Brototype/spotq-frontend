import { Eye } from "lucide-react";
import { useMemo } from "react";
import { type Column, DataTable } from "@/components/common/table";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils/date";
import {
  DATE_ONLY_FORMAT_OPTIONS,
  SUBSCRIBER_MESSAGES,
  SUBSCRIBER_SORT_BY,
} from "../constants/subscriber.constants";
import type { SubscriberSummary } from "../types/subscriber.types";
import { formatBillingCycle, formatPrice } from "../utils/subscriber.utils";
import { SubscriberEmptyState } from "./SubscriberEmptyState";
import { SubscriberStatusBadge } from "./SubscriberStatusBadge";

export interface SubscriberTableProps {
  subscribers: SubscriberSummary[];
  onViewDetails: (subscriber: SubscriberSummary) => void;
  isFiltered?: boolean;
  onResetFilters?: () => void;
  isLoading?: boolean;
  loadingRowCount?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  onSort?: (field: string, direction?: "asc" | "desc") => void;
}

export function SubscriberTable({
  subscribers,
  onViewDetails,
  isFiltered = false,
  onResetFilters,
  isLoading = false,
  loadingRowCount,
  sortBy,
  sortOrder,
  onSort,
}: SubscriberTableProps) {
  const columns = useMemo<Column<SubscriberSummary>[]>(
    () => [
      {
        key: "restaurant",
        header: SUBSCRIBER_MESSAGES.TABLE_HEADER_RESTAURANT,
        width: "160px",
        headerClassName: "font-semibold text-slate-700 min-w-[150px]",
        cell: ({ row }) => (
          <span className="font-semibold text-slate-900 line-clamp-1">
            {row.restaurantName || SUBSCRIBER_MESSAGES.NOT_APPLICABLE}
          </span>
        ),
      },
      {
        key: "subscriber",
        header: SUBSCRIBER_MESSAGES.TABLE_HEADER_SUBSCRIBER,
        width: "180px",
        headerClassName: "font-semibold text-slate-700 min-w-[150px]",
        cell: ({ row }) => (
          <div className="flex flex-col">
            <span className="font-medium text-slate-800 line-clamp-1">
              {row.subscriberName || SUBSCRIBER_MESSAGES.NOT_APPLICABLE}
            </span>
            {row.subscriberEmail && row.subscriberEmail !== "-" && (
              <span className="text-xs text-slate-500 line-clamp-1">{row.subscriberEmail}</span>
            )}
          </div>
        ),
      },
      {
        key: "plan",
        header: SUBSCRIBER_MESSAGES.TABLE_HEADER_PLAN,
        width: "140px",
        headerClassName: "font-semibold text-slate-700 min-w-[120px]",
        cell: ({ row }) => (
          <div className="flex flex-col">
            <span className="font-medium text-slate-800">
              {row.planName || row.planCode || SUBSCRIBER_MESSAGES.NOT_APPLICABLE}
            </span>
            <span className="text-[11px] font-mono text-slate-400">{row.planCode}</span>
          </div>
        ),
      },
      {
        key: "billingCycle",
        header: SUBSCRIBER_MESSAGES.TABLE_HEADER_CYCLE,
        width: "100px",
        headerClassName: "font-semibold text-slate-700 min-w-[90px]",
        cell: ({ row }) => (
          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-slate-100 text-slate-700">
            {formatBillingCycle(row.billingCycle)}
          </span>
        ),
      },
      {
        key: "price",
        header: SUBSCRIBER_MESSAGES.TABLE_HEADER_PRICE,
        width: "110px",
        headerClassName: "font-semibold text-slate-700 min-w-[90px]",
        cell: ({ row }) => (
          <span className="font-medium text-slate-900">{formatPrice(row.price, row.currency)}</span>
        ),
      },
      {
        key: "status",
        header: SUBSCRIBER_MESSAGES.TABLE_HEADER_STATUS,
        sortable: true,
        sortKey: SUBSCRIBER_SORT_BY.STATUS,
        width: "110px",
        headerClassName: "font-semibold text-slate-700 min-w-[100px]",
        cell: ({ row }) => <SubscriberStatusBadge status={row.status} />,
      },
      {
        key: "startDate",
        header: SUBSCRIBER_MESSAGES.TABLE_HEADER_START_DATE,
        sortable: true,
        sortKey: SUBSCRIBER_SORT_BY.CURRENT_PERIOD_START,
        width: "120px",
        headerClassName: "font-semibold text-slate-700 min-w-[105px]",
        cell: ({ row }) => (
          <span className="text-sm text-slate-600">
            {formatDate(row.currentPeriodStart || row.createdAt, DATE_ONLY_FORMAT_OPTIONS)}
          </span>
        ),
      },
      {
        key: "renewal",
        header: SUBSCRIBER_MESSAGES.TABLE_HEADER_RENEWAL,
        sortable: true,
        sortKey: SUBSCRIBER_SORT_BY.CURRENT_PERIOD_END,
        width: "120px",
        headerClassName: "font-semibold text-slate-700 min-w-[105px]",
        cell: ({ row }) => (
          <span className="text-sm text-slate-600">
            {formatDate(row.currentPeriodEnd, DATE_ONLY_FORMAT_OPTIONS)}
          </span>
        ),
      },
      {
        key: "actions",
        header: SUBSCRIBER_MESSAGES.TABLE_HEADER_ACTIONS,
        align: "right",
        width: "120px",
        headerClassName: "text-right font-semibold text-slate-700 min-w-[105px]",
        className: "text-right",
        cell: ({ row }) => (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onViewDetails(row)}
            className="gap-1.5 text-xs text-slate-700 hover:text-slate-900 border-slate-200 hover:bg-slate-100"
            data-testid={`view-subscriber-btn-${row.id}`}
          >
            <Eye className="size-3.5" />
            <span>{SUBSCRIBER_MESSAGES.VIEW_DETAILS}</span>
          </Button>
        ),
      },
    ],
    [onViewDetails],
  );

  return (
    <DataTable<SubscriberSummary>
      data={subscribers}
      columns={columns}
      getRowId={(row) => row.id}
      getRowTestId={(row) => `subscriber-row-${row.id}`}
      isLoading={isLoading}
      loadingRowCount={loadingRowCount}
      sortBy={sortBy}
      sortOrder={sortOrder}
      onSort={onSort ? (key, direction) => onSort(key, direction) : undefined}
      emptyState={<SubscriberEmptyState isFiltered={isFiltered} onResetFilters={onResetFilters} />}
      testId="subscriber-table"
      theme="admin"
    />
  );
}
