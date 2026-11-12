/**
 * useCustomerPaymentHistory Hook
 * Fetches and manages customer dining payment transactions with server-side
 * pagination and status filtering.
 */

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import {
  CUSTOMER_PAYMENT_DEFAULTS,
  CUSTOMER_PAYMENT_QUERY_KEYS,
} from "@/features/payments/constants/customer-payment.constants";
import { customerPaymentService } from "@/features/payments/services/customer-payment.service";
import type {
  CustomerPaymentPagination,
  CustomerPaymentSortBy,
  CustomerPaymentSortOrder,
  CustomerPaymentTransaction,
  PaymentFilterStatus,
} from "@/features/payments/types/customer-payment.types";

interface UseCustomerPaymentHistoryOptions {
  initialPage?: number;
  initialStatus?: PaymentFilterStatus;
  initialStartDate?: string;
  initialEndDate?: string;
  initialSortBy?: CustomerPaymentSortBy;
  initialSortOrder?: CustomerPaymentSortOrder;
  limit?: number;
}

export function useCustomerPaymentHistory(options: UseCustomerPaymentHistoryOptions = {}) {
  const [page, setPage] = useState<number>(options.initialPage ?? CUSTOMER_PAYMENT_DEFAULTS.PAGE);
  const [status, setStatusState] = useState<PaymentFilterStatus>(
    options.initialStatus ?? CUSTOMER_PAYMENT_DEFAULTS.STATUS,
  );
  const [startDate, setStartDateState] = useState<string>(options.initialStartDate ?? "");
  const [endDate, setEndDateState] = useState<string>(options.initialEndDate ?? "");
  const [sortBy, setSortByState] = useState<CustomerPaymentSortBy>(
    options.initialSortBy ?? CUSTOMER_PAYMENT_DEFAULTS.SORT_BY,
  );
  const [sortOrder, setSortOrderState] = useState<CustomerPaymentSortOrder>(
    options.initialSortOrder ?? CUSTOMER_PAYMENT_DEFAULTS.SORT_ORDER,
  );

  const limit = options.limit ?? CUSTOMER_PAYMENT_DEFAULTS.LIMIT;

  const setStatus = (newStatus: PaymentFilterStatus) => {
    setStatusState(newStatus);
    setPage(1);
  };

  const setStartDate = (date: string) => {
    setStartDateState(date);
    setPage(1);
  };

  const setEndDate = (date: string) => {
    setEndDateState(date);
    setPage(1);
  };

  const setDateRange = (newStartDate: string, newEndDate: string) => {
    setStartDateState(newStartDate);
    setEndDateState(newEndDate);
    setPage(1);
  };

  const clearDateRange = () => {
    setStartDateState("");
    setEndDateState("");
    setPage(1);
  };

  const setSort = (newSortBy: CustomerPaymentSortBy, newSortOrder: CustomerPaymentSortOrder) => {
    setSortByState(newSortBy);
    setSortOrderState(newSortOrder);
    setPage(1);
  };

  const handleToggleSort = (field: CustomerPaymentSortBy) => {
    if (sortBy === field) {
      setSortOrderState((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortByState(field);
      setSortOrderState("desc");
    }
    setPage(1);
  };

  const queryKey = CUSTOMER_PAYMENT_QUERY_KEYS.HISTORY({
    page,
    limit,
    status,
    startDate: startDate || undefined,
    endDate: endDate || undefined,
    sortBy,
    sortOrder,
  });

  const { data, isLoading, isFetching, isError, error, refetch } = useQuery({
    queryKey,
    queryFn: () =>
      customerPaymentService.getPaymentHistory({
        page,
        limit,
        status,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
        sortBy,
        sortOrder,
      }),
    placeholderData: keepPreviousData,
    staleTime: 30_000,
  });

  const transactions: CustomerPaymentTransaction[] = data?.transactions ?? [];

  const pagination: CustomerPaymentPagination = data?.pagination ?? {
    currentPage: page,
    pageSize: limit,
    totalItems: 0,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
  };

  return {
    transactions,
    pagination,
    page,
    setPage,
    status,
    setStatus,
    startDate,
    endDate,
    setStartDate,
    setEndDate,
    setDateRange,
    clearDateRange,
    isDateFiltered: Boolean(startDate || endDate),
    sortBy,
    sortOrder,
    setSort,
    handleToggleSort,
    isLoading,
    isFetching,
    isError,
    error: error as Error | null,
    refetch,
  };
}
