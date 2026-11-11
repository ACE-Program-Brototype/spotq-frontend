import { act, renderHook } from "@testing-library/react";
import { useAnalyticsFilters } from "../hooks/use-analytics-filters";
import { ANALYTICS_PERIODS, ORDER_STATUS_FILTERS } from "../types/restaurant-analytics.types";

describe("useAnalyticsFilters", () => {
  it("initializes with default month interval and current calendar parts", () => {
    const { result } = renderHook(() => useAnalyticsFilters());

    expect(result.current.interval).toBe(ANALYTICS_PERIODS.MONTH);
    expect(result.current.status).toBe(ORDER_STATUS_FILTERS.ALL);
    expect(result.current.page).toBe(1);
    expect(result.current.limit).toBe(10);
    expect(result.current.day).toBeUndefined();
    expect(typeof result.current.month).toBe("number");
    expect(typeof result.current.year).toBe("number");
    expect(result.current.queryParams.interval).toBe(ANALYTICS_PERIODS.MONTH);
  });

  it("attaches day when switched to DAY interval", () => {
    const { result } = renderHook(() => useAnalyticsFilters());

    act(() => {
      result.current.setInterval(ANALYTICS_PERIODS.DAY);
    });

    expect(result.current.interval).toBe(ANALYTICS_PERIODS.DAY);
    expect(typeof result.current.day).toBe("number");
    expect(result.current.queryParams.day).toBeDefined();
  });

  it("removes day when switched back to MONTH interval", () => {
    const { result } = renderHook(() => useAnalyticsFilters());

    act(() => {
      result.current.setInterval(ANALYTICS_PERIODS.DAY);
    });
    expect(result.current.day).toBeDefined();

    act(() => {
      result.current.setInterval(ANALYTICS_PERIODS.MONTH);
    });
    expect(result.current.day).toBeUndefined();
    expect(result.current.queryParams.day).toBeUndefined();
  });

  it("updates individual date parts and status", () => {
    const { result } = renderHook(() => useAnalyticsFilters());

    act(() => {
      result.current.setMonth(5);
      result.current.setYear(2025);
      result.current.setStatus(ORDER_STATUS_FILTERS.COMPLETED);
      result.current.setPage(3);
    });

    expect(result.current.month).toBe(5);
    expect(result.current.year).toBe(2025);
    expect(result.current.status).toBe(ORDER_STATUS_FILTERS.COMPLETED);
    expect(result.current.page).toBe(3);
    expect(result.current.queryParams.status).toBe(ORDER_STATUS_FILTERS.COMPLETED);
    expect(result.current.queryParams.page).toBe(3);
  });

  it("resets filters back to defaults", () => {
    const { result } = renderHook(() => useAnalyticsFilters());

    act(() => {
      result.current.setInterval(ANALYTICS_PERIODS.YEAR);
      result.current.setStatus(ORDER_STATUS_FILTERS.CANCELLED);
      result.current.setPage(4);
    });

    act(() => {
      result.current.resetFilters();
    });

    expect(result.current.interval).toBe(ANALYTICS_PERIODS.MONTH);
    expect(result.current.status).toBe(ORDER_STATUS_FILTERS.ALL);
    expect(result.current.page).toBe(1);
  });
});
