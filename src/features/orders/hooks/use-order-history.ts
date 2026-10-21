/**
 * useOrderHistory Hook
 * React Query integration for Customer Order History with URL searchParams synchronization.
 */

import { useQuery } from "@tanstack/react-query";
import { useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import {
  ORDER_DEFAULT_PAGINATION,
  ORDER_DEFAULTS,
  ORDER_FILTER_STATUS,
  ORDER_QUERY_KEYS,
  ORDER_QUERY_PARAMS,
} from "../constants/orders.constants";
import { ordersService } from "../services/orders.service";
import type { OrderFilterStatus } from "../types/orders.types";

export interface UseOrderHistoryOptions {
  initialPage?: number;
  initialLimit?: number;
  initialStatus?: OrderFilterStatus;
}

export function useOrderHistory(options?: UseOrderHistoryOptions) {
  const [searchParams, setSearchParams] = useSearchParams();

  const pageParam = Number(searchParams.get(ORDER_QUERY_PARAMS.PAGE));
  const page =
    Number.isInteger(pageParam) && pageParam > 0
      ? pageParam
      : (options?.initialPage ?? ORDER_DEFAULTS.PAGE);

  const limitParam = Number(searchParams.get(ORDER_QUERY_PARAMS.LIMIT));
  const limit =
    Number.isInteger(limitParam) && limitParam > 0
      ? limitParam
      : (options?.initialLimit ?? ORDER_DEFAULTS.LIMIT);

  const rawStatus = searchParams.get(ORDER_QUERY_PARAMS.STATUS)?.toUpperCase();
  const isValidStatus =
    rawStatus && Object.values(ORDER_FILTER_STATUS).includes(rawStatus as OrderFilterStatus);
  const status: OrderFilterStatus = isValidStatus
    ? (rawStatus as OrderFilterStatus)
    : (options?.initialStatus ?? ORDER_DEFAULTS.FILTER_STATUS);

  const queryKey = ORDER_QUERY_KEYS.HISTORY({ page, limit, status });

  const query = useQuery({
    queryKey,
    queryFn: () => ordersService.getOrderHistory({ page, limit, status }),
  });

  const handleStatusChange = useCallback(
    (newStatus: OrderFilterStatus) => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          if (newStatus === ORDER_FILTER_STATUS.ALL) {
            next.delete(ORDER_QUERY_PARAMS.STATUS);
          } else {
            next.set(ORDER_QUERY_PARAMS.STATUS, newStatus);
          }
          next.set(ORDER_QUERY_PARAMS.PAGE, String(ORDER_DEFAULTS.PAGE));
          return next;
        },
        { replace: true },
      );
    },
    [setSearchParams],
  );

  const handlePageChange = useCallback(
    (newPage: number) => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          next.set(ORDER_QUERY_PARAMS.PAGE, String(Math.max(ORDER_DEFAULTS.PAGE, newPage)));
          return next;
        },
        { replace: true },
      );
    },
    [setSearchParams],
  );

  const handleLimitChange = useCallback(
    (newLimit: number) => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          if (newLimit === ORDER_DEFAULTS.LIMIT) {
            next.delete(ORDER_QUERY_PARAMS.LIMIT);
          } else {
            next.set(ORDER_QUERY_PARAMS.LIMIT, String(newLimit));
          }
          next.set(ORDER_QUERY_PARAMS.PAGE, String(ORDER_DEFAULTS.PAGE));
          return next;
        },
        { replace: true },
      );
    },
    [setSearchParams],
  );

  return {
    ...query,
    orders: query.data?.orders ?? [],
    pagination: query.data?.pagination ?? ORDER_DEFAULT_PAGINATION(page),
    page,
    setPage: handlePageChange,
    limit,
    setLimit: handleLimitChange,
    status,
    setStatus: handleStatusChange,
    isFiltered: status !== ORDER_FILTER_STATUS.ALL,
  };
}
