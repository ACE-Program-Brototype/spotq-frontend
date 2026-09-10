import { AlertCircle, RefreshCw } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { Pagination } from "@/components/common/Pagination";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CustomerEmptyState } from "../components/CustomerEmptyState";
import { CustomerFilters } from "../components/CustomerFilters";
import { CustomerTable } from "../components/CustomerTable";
import { CustomerTableSkeleton } from "../components/CustomerTableSkeleton";
import {
  CUSTOMER_MESSAGES,
  CUSTOMER_STATUS,
  type CustomerStatusType,
} from "../constants/customer.constants";
import { useCustomers, useUpdateCustomerStatus } from "../hooks/use-customers";
import type { Customer } from "../types/customer.types";

export function AdminCustomersPage() {
  const {
    customers,
    pagination,
    isLoading,
    isError,
    refetch,
    page,
    setPage,
    limit,
    status,
    setStatus,
    search,
    setSearch,
    resetFilters,
    isFiltered,
  } = useCustomers();

  const { mutateAsync: updateStatus, isPending: isUpdatingStatus } = useUpdateCustomerStatus();

  // Action Confirmation state
  const [statusTarget, setStatusTarget] = useState<{
    customer: Customer;
    nextStatus: CustomerStatusType;
  } | null>(null);

  const handleStatusAction = (customer: Customer, nextStatus: CustomerStatusType) => {
    setStatusTarget({ customer, nextStatus });
  };

  const handleConfirmStatusChange = async () => {
    if (!statusTarget) return;

    try {
      await updateStatus({
        userId: statusTarget.customer.id,
        status: statusTarget.nextStatus,
      });

      toast.success(
        statusTarget.nextStatus === CUSTOMER_STATUS.BLOCKED
          ? CUSTOMER_MESSAGES.BLOCK_SUCCESS
          : CUSTOMER_MESSAGES.UNBLOCK_SUCCESS,
      );
      setStatusTarget(null);
    } catch {
      toast.error(CUSTOMER_MESSAGES.STATUS_UPDATE_ERROR);
    }
  };

  const isBlockedAction = statusTarget?.nextStatus === CUSTOMER_STATUS.BLOCKED;

  return (
    <div className="space-y-6" data-testid="admin-customers-page">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          {CUSTOMER_MESSAGES.PAGE_TITLE}
        </h1>
        <p className="mt-1 text-sm text-slate-500">{CUSTOMER_MESSAGES.PAGE_SUBTITLE}</p>
      </div>

      {/* Filter and Search Bar */}
      <CustomerFilters
        search={search}
        onSearchChange={setSearch}
        status={status}
        onStatusChange={setStatus}
        disabled={isLoading}
      />

      {/* Main Table Card */}
      <Card className="border-slate-200/80 shadow-xs overflow-hidden bg-white">
        <CardContent className="p-0">
          {isLoading ? (
            <CustomerTableSkeleton rowCount={limit > 10 ? 10 : limit} />
          ) : isError ? (
            <div
              role="alert"
              className="flex flex-col items-center justify-center py-16 px-4 text-center"
              data-testid="customer-error-state"
            >
              <div className="flex size-14 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 mb-4 shadow-xs">
                <AlertCircle className="size-7" />
              </div>
              <h3 className="text-base font-bold text-slate-900">
                {CUSTOMER_MESSAGES.ERROR_TITLE}
              </h3>
              <p className="mt-1 text-xs text-slate-500 max-w-sm">
                {CUSTOMER_MESSAGES.ERROR_DESCRIPTION}
              </p>
              <div className="mt-5">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => refetch()}
                  className="rounded-xl border-slate-200 text-xs font-semibold hover:bg-slate-50 gap-2"
                >
                  <RefreshCw className="size-3.5" />
                  {CUSTOMER_MESSAGES.RETRY_BUTTON}
                </Button>
              </div>
            </div>
          ) : customers.length === 0 ? (
            <CustomerEmptyState isFiltered={isFiltered} onClearFilters={resetFilters} />
          ) : (
            <CustomerTable
              customers={customers}
              onStatusAction={handleStatusAction}
              isActionLoading={isUpdatingStatus}
              actionTargetId={statusTarget?.customer.id}
            />
          )}

          {/* Pagination Footer */}
          {!isLoading && !isError && customers.length > 0 && pagination && (
            <div className="border-t border-slate-200/80">
              <Pagination
                currentPage={page}
                totalPages={pagination.totalPages}
                totalItems={pagination.total}
                pageSize={limit}
                theme="admin"
                onPageChange={setPage}
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Block / Unblock Confirm Dialog */}
      <ConfirmDialog
        open={!!statusTarget}
        title={
          isBlockedAction
            ? CUSTOMER_MESSAGES.BLOCK_CONFIRM_TITLE
            : CUSTOMER_MESSAGES.UNBLOCK_CONFIRM_TITLE
        }
        description={
          statusTarget
            ? isBlockedAction
              ? CUSTOMER_MESSAGES.BLOCK_CONFIRM_DESCRIPTION(statusTarget.customer.fullName)
              : CUSTOMER_MESSAGES.UNBLOCK_CONFIRM_DESCRIPTION(statusTarget.customer.fullName)
            : ""
        }
        confirmText={
          isBlockedAction
            ? CUSTOMER_MESSAGES.CONFIRM_BLOCK_BUTTON
            : CUSTOMER_MESSAGES.CONFIRM_UNBLOCK_BUTTON
        }
        confirmVariant={isBlockedAction ? "destructive" : "default"}
        isLoading={isUpdatingStatus}
        onConfirm={handleConfirmStatusChange}
        onCancel={() => setStatusTarget(null)}
      />
    </div>
  );
}

export default AdminCustomersPage;
