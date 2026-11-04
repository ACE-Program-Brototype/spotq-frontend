/**
 * TransactionsTable Component
 * Responsive tabular presentation built with SpotQ's shared DataTable primitive.
 */

import { Eye, User } from "lucide-react";
import { useMemo } from "react";
import { type Column, DataTable } from "@/components/common/table";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils/date";
import { TRANSACTION_MESSAGES } from "../constants/transaction-messages.constants";
import type { PaginationData, PaymentTransactionItem } from "../types/transaction.types";
import { PaymentMethodBadge } from "./PaymentMethodBadge";
import { SettlementStatusBadge } from "./SettlementStatusBadge";
import { TransactionStatusBadge } from "./TransactionStatusBadge";

interface TransactionsTableProps {
  transactions: readonly PaymentTransactionItem[];
  pagination?: PaginationData;
  isLoading?: boolean;
  sortBy: string;
  sortOrder: "asc" | "desc";
  onSortChange: (columnKey: string, direction: "asc" | "desc") => void;
  onPageChange: (page: number) => void;
  onSelectTransaction: (transactionId: string) => void;
}

export function TransactionsTable({
  transactions,
  pagination,
  isLoading = false,
  sortBy,
  sortOrder,
  onSortChange,
  onPageChange,
  onSelectTransaction,
}: TransactionsTableProps) {
  const columns = useMemo<Column<PaymentTransactionItem>[]>(() => {
    return [
      {
        key: "createdAt",
        header: TRANSACTION_MESSAGES.TABLE_HEADERS.DATE_TIME,
        sortable: true,
        sortKey: "createdAt",
        cell: ({ row }) => (
          <span className="text-xs text-neutral-600 whitespace-nowrap font-medium">
            {formatDate(row.createdAt)}
          </span>
        ),
      },
      {
        key: "orderNumber",
        header: TRANSACTION_MESSAGES.TABLE_HEADERS.ORDER_NUMBER,
        cell: ({ row }) =>
          row.orderNumber ? (
            <span className="inline-flex items-center gap-1 font-mono text-xs font-bold text-neutral-900 bg-neutral-100 px-2 py-0.5 rounded-lg border border-neutral-200/80">
              #{row.orderNumber}
            </span>
          ) : (
            <span className="text-neutral-400 font-mono text-xs">-</span>
          ),
      },
      {
        key: "customerName",
        header: TRANSACTION_MESSAGES.TABLE_HEADERS.CUSTOMER,
        cell: ({ row }) => (
          <div className="flex items-center gap-2 max-w-[160px]">
            <div className="size-6 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-500 shrink-0">
              <User className="size-3.5" />
            </div>
            <span
              className="text-xs font-semibold text-neutral-800 truncate"
              title={row.customerName}
            >
              {row.customerName || "Guest"}
            </span>
          </div>
        ),
      },
      {
        key: "paymentMethod",
        header: TRANSACTION_MESSAGES.TABLE_HEADERS.METHOD,
        cell: ({ row }) => <PaymentMethodBadge method={row.paymentMethod} />,
      },
      {
        key: "amountPaise",
        header: TRANSACTION_MESSAGES.TABLE_HEADERS.AMOUNT,
        sortable: true,
        sortKey: "amountPaise",
        cell: ({ row }) => (
          <span className="text-xs font-bold text-neutral-900 whitespace-nowrap">
            {row.amountFormatted || `₹${(row.amountPaise / 100).toFixed(2)}`}
          </span>
        ),
      },
      {
        key: "status",
        header: TRANSACTION_MESSAGES.TABLE_HEADERS.STATUS,
        cell: ({ row }) => <TransactionStatusBadge status={row.status} />,
      },
      {
        key: "settlementStatus",
        header: TRANSACTION_MESSAGES.TABLE_HEADERS.SETTLEMENT,
        cell: ({ row }) => <SettlementStatusBadge status={row.settlementStatus} />,
      },
      {
        key: "actions",
        header: TRANSACTION_MESSAGES.TABLE_HEADERS.ACTIONS,
        align: "right",
        cell: ({ row }) => (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onSelectTransaction(row.id);
            }}
            data-testid={`view-details-${row.id}`}
            className="h-8 px-2.5 rounded-lg text-xs font-medium text-neutral-700 hover:text-neutral-900 hover:bg-neutral-100 gap-1.5"
          >
            <Eye className="size-3.5 text-neutral-400" />
            <span>{TRANSACTION_MESSAGES.VIEW_DETAILS}</span>
          </Button>
        ),
      },
    ];
  }, [onSelectTransaction]);

  const paginationProps = pagination
    ? {
        currentPage: pagination.currentPage,
        totalPages: pagination.totalPages,
        totalItems: pagination.totalItems,
        pageSize: pagination.limit,
        onPageChange,
        theme: "restaurant" as const,
      }
    : undefined;

  return (
    <div className="rounded-2xl border border-neutral-200/80 bg-white shadow-2xs overflow-hidden">
      <DataTable<PaymentTransactionItem>
        data={transactions}
        columns={columns}
        getRowId={(row) => row.id}
        isLoading={isLoading}
        loadingRowCount={5}
        onRowClick={(row) => onSelectTransaction(row.id)}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSort={onSortChange}
        pagination={paginationProps}
        emptyTitle={TRANSACTION_MESSAGES.EMPTY_TITLE}
        emptyDescription={TRANSACTION_MESSAGES.EMPTY_DESCRIPTION}
        theme="restaurant"
      />
    </div>
  );
}
