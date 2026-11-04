/**
 * useTransactionFilters Hook
 * Manages local filter state, debounced search (300ms), date preset conversions, and pagination.
 */

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  DATE_PRESET_OPTIONS,
  PAYMENT_METHOD_FILTER,
  TRANSACTION_DEFAULTS,
  TRANSACTION_STATUS_FILTER,
} from "../constants/transaction.constants";
import type { GetTransactionsParams, TransactionFiltersState } from "../types/transaction.types";

function formatIsoDateOnly(date: Date): string {
  const yyyy = date.getUTCFullYear();
  const mm = String(date.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(date.getUTCDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export function getDateRangeFromPreset(preset: string): {
  startDate: string;
  endDate: string;
} {
  const now = new Date();
  const todayStr = formatIsoDateOnly(now);

  switch (preset) {
    case DATE_PRESET_OPTIONS.TODAY:
      return { startDate: todayStr, endDate: todayStr };

    case DATE_PRESET_OPTIONS.YESTERDAY: {
      const yesterday = new Date(now);
      yesterday.setUTCDate(yesterday.getUTCDate() - 1);
      const yesterdayStr = formatIsoDateOnly(yesterday);
      return { startDate: yesterdayStr, endDate: yesterdayStr };
    }

    case DATE_PRESET_OPTIONS.LAST_7_DAYS: {
      const past7 = new Date(now);
      past7.setUTCDate(past7.getUTCDate() - 7);
      return { startDate: formatIsoDateOnly(past7), endDate: todayStr };
    }

    case DATE_PRESET_OPTIONS.THIS_MONTH: {
      const firstOfMonth = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
      return { startDate: formatIsoDateOnly(firstOfMonth), endDate: todayStr };
    }

    default:
      return { startDate: "", endDate: "" };
  }
}

export function useTransactionFilters() {
  const [searchInput, setSearchInput] = useState<string>("");
  const [debouncedSearch, setDebouncedSearch] = useState<string>("");
  const [status, setStatus] = useState<string>(TRANSACTION_STATUS_FILTER.ALL);
  const [method, setMethod] = useState<string>(PAYMENT_METHOD_FILTER.ALL);
  const [datePreset, setDatePreset] = useState<string>(DATE_PRESET_OPTIONS.ALL);
  const [customStartDate, setCustomStartDate] = useState<string>("");
  const [customEndDate, setCustomEndDate] = useState<string>("");
  const [page, setPage] = useState<number>(TRANSACTION_DEFAULTS.PAGE);
  const [limit, setLimit] = useState<number>(TRANSACTION_DEFAULTS.LIMIT);
  const [sortBy, setSortBy] = useState<string>(TRANSACTION_DEFAULTS.SORT_BY);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">(TRANSACTION_DEFAULTS.SORT_ORDER);

  // Debounce search input by 300ms
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchInput.trim());
      setPage(1);
    }, TRANSACTION_DEFAULTS.SEARCH_DEBOUNCE_MS);

    return () => clearTimeout(handler);
  }, [searchInput]);

  // Handle Date Preset Changes
  const handleDatePresetChange = useCallback((newPreset: string) => {
    setDatePreset(newPreset);
    setPage(1);

    if (newPreset !== DATE_PRESET_OPTIONS.CUSTOM) {
      const { startDate, endDate } = getDateRangeFromPreset(newPreset);
      setCustomStartDate(startDate);
      setCustomEndDate(endDate);
    }
  }, []);

  const handleStatusChange = useCallback((newStatus: string) => {
    setStatus(newStatus);
    setPage(1);
  }, []);

  const handleMethodChange = useCallback((newMethod: string) => {
    setMethod(newMethod);
    setPage(1);
  }, []);

  const handleCustomStartDateChange = useCallback((date: string) => {
    setDatePreset(DATE_PRESET_OPTIONS.CUSTOM);
    setCustomStartDate(date);
    setPage(1);
  }, []);

  const handleCustomEndDateChange = useCallback((date: string) => {
    setDatePreset(DATE_PRESET_OPTIONS.CUSTOM);
    setCustomEndDate(date);
    setPage(1);
  }, []);

  const handleSortChange = useCallback((columnKey: string, direction: "asc" | "desc") => {
    setSortBy(columnKey);
    setSortOrder(direction);
  }, []);

  const resetFilters = useCallback(() => {
    setSearchInput("");
    setDebouncedSearch("");
    setStatus(TRANSACTION_STATUS_FILTER.ALL);
    setMethod(PAYMENT_METHOD_FILTER.ALL);
    setDatePreset(DATE_PRESET_OPTIONS.ALL);
    setCustomStartDate("");
    setCustomEndDate("");
    setPage(TRANSACTION_DEFAULTS.PAGE);
    setSortBy(TRANSACTION_DEFAULTS.SORT_BY);
    setSortOrder(TRANSACTION_DEFAULTS.SORT_ORDER);
  }, []);

  const isFiltered = useMemo(() => {
    return (
      searchInput.trim().length > 0 ||
      status !== TRANSACTION_STATUS_FILTER.ALL ||
      method !== PAYMENT_METHOD_FILTER.ALL ||
      datePreset !== DATE_PRESET_OPTIONS.ALL ||
      customStartDate.length > 0 ||
      customEndDate.length > 0
    );
  }, [searchInput, status, method, datePreset, customStartDate, customEndDate]);

  // Client-side date range validation
  const isDateRangeInvalid = useMemo(() => {
    return Boolean(
      customStartDate && customEndDate && new Date(customStartDate) > new Date(customEndDate),
    );
  }, [customStartDate, customEndDate]);

  // Derived API query parameters
  const queryParams = useMemo<GetTransactionsParams>(() => {
    const params: GetTransactionsParams = {
      page,
      limit,
      sortBy,
      sortOrder,
    };

    if (debouncedSearch.length > 0) {
      params.search = debouncedSearch;
    }

    if (status !== TRANSACTION_STATUS_FILTER.ALL) {
      params.status = status;
    }

    if (method !== PAYMENT_METHOD_FILTER.ALL) {
      params.method = method;
    }

    // Only forward dates if valid (do not send inverted dates that trigger 400 Bad Request)
    const hasValidDates =
      !customStartDate || !customEndDate || new Date(customStartDate) <= new Date(customEndDate);

    if (hasValidDates) {
      if (customStartDate.length > 0) {
        params.startDate = customStartDate;
      }

      if (customEndDate.length > 0) {
        params.endDate = customEndDate;
      }
    }

    return params;
  }, [
    page,
    limit,
    sortBy,
    sortOrder,
    debouncedSearch,
    status,
    method,
    customStartDate,
    customEndDate,
  ]);

  const filterState: TransactionFiltersState = {
    search: searchInput,
    status,
    method,
    datePreset,
    startDate: customStartDate,
    endDate: customEndDate,
    page,
    limit,
    sortBy,
    sortOrder,
  };

  return {
    filterState,
    queryParams,
    searchInput,
    setSearchInput,
    status,
    handleStatusChange,
    method,
    handleMethodChange,
    datePreset,
    handleDatePresetChange,
    customStartDate,
    handleCustomStartDateChange,
    customEndDate,
    handleCustomEndDateChange,
    page,
    setPage,
    limit,
    setLimit,
    sortBy,
    sortOrder,
    handleSortChange,
    resetFilters,
    isFiltered,
    isDateRangeInvalid,
  };
}
