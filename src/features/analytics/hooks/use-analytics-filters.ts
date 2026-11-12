import { useCallback, useMemo, useState } from "react";
import {
  ANALYTICS_PERIODS,
  type AnalyticsPeriod,
  ORDER_STATUS_FILTERS,
  type OrderStatusFilter,
  type RestaurantAnalyticsQueryParams,
} from "@/features/analytics/types/restaurant-analytics.types";

export interface AnalyticsFilterState {
  interval: AnalyticsPeriod;
  day?: number;
  month: number;
  year: number;
  status: OrderStatusFilter;
  page: number;
  limit: number;
}

export function useAnalyticsFilters(initialState?: Partial<AnalyticsFilterState>) {
  const now = useMemo(() => new Date(), []);
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;
  const currentDay = now.getDate();

  const [interval, setIntervalState] = useState<AnalyticsPeriod>(
    initialState?.interval ?? ANALYTICS_PERIODS.MONTH,
  );
  const [day, setDayState] = useState<number | undefined>(
    initialState?.day ?? (interval === ANALYTICS_PERIODS.DAY ? currentDay : undefined),
  );
  const [month, setMonthState] = useState<number>(initialState?.month ?? currentMonth);
  const [year, setYearState] = useState<number>(initialState?.year ?? currentYear);
  const [status, setStatusState] = useState<OrderStatusFilter>(
    initialState?.status ?? ORDER_STATUS_FILTERS.ALL,
  );
  const [page, setPageState] = useState<number>(initialState?.page ?? 1);
  const [limit, setLimitState] = useState<number>(initialState?.limit ?? 10);

  const setInterval = useCallback(
    (newInterval: AnalyticsPeriod) => {
      setIntervalState(newInterval);
      setPageState(1); // Reset page on interval switch

      if (newInterval === ANALYTICS_PERIODS.DAY) {
        setDayState(currentDay);
        setMonthState(currentMonth);
        setYearState(currentYear);
      } else if (newInterval === ANALYTICS_PERIODS.WEEK) {
        setDayState(currentDay);
        setMonthState(currentMonth);
        setYearState(currentYear);
      } else if (newInterval === ANALYTICS_PERIODS.MONTH) {
        setDayState(undefined);
        setMonthState(currentMonth);
        setYearState(currentYear);
      } else if (newInterval === ANALYTICS_PERIODS.YEAR) {
        setDayState(undefined);
        setYearState(currentYear);
      }
    },
    [currentDay, currentMonth, currentYear],
  );

  const setMonth = useCallback((newMonth: number) => {
    setMonthState(newMonth);
    setPageState(1);
  }, []);

  const setYear = useCallback((newYear: number) => {
    setYearState(newYear);
    setPageState(1);
  }, []);

  const setDay = useCallback((newDay: number) => {
    setDayState(newDay);
    setPageState(1);
  }, []);

  const setStatus = useCallback((newStatus: OrderStatusFilter) => {
    setStatusState(newStatus);
    setPageState(1);
  }, []);

  const setPage = useCallback((newPage: number) => {
    setPageState(newPage);
  }, []);

  const setLimit = useCallback((newLimit: number) => {
    setLimitState(newLimit);
    setPageState(1);
  }, []);

  const resetFilters = useCallback(() => {
    setIntervalState(ANALYTICS_PERIODS.MONTH);
    setDayState(undefined);
    setMonthState(currentMonth);
    setYearState(currentYear);
    setStatusState(ORDER_STATUS_FILTERS.ALL);
    setPageState(1);
    setLimitState(10);
  }, [currentMonth, currentYear]);

  const queryParams: RestaurantAnalyticsQueryParams = useMemo(() => {
    const params: RestaurantAnalyticsQueryParams = {
      interval,
      month,
      year,
      status,
      page,
      limit,
    };
    if (
      day !== undefined &&
      (interval === ANALYTICS_PERIODS.DAY || interval === ANALYTICS_PERIODS.WEEK)
    ) {
      params.day = day;
    }
    return params;
  }, [interval, month, year, status, page, limit, day]);

  return {
    interval,
    day,
    month,
    year,
    status,
    page,
    limit,
    queryParams,
    setInterval,
    setDay,
    setMonth,
    setYear,
    setStatus,
    setPage,
    setLimit,
    resetFilters,
  };
}
