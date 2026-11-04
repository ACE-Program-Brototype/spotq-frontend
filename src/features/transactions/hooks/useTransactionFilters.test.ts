import { act, renderHook } from "@testing-library/react";
import {
  DATE_PRESET_OPTIONS,
  PAYMENT_METHOD_FILTER,
  TRANSACTION_STATUS_FILTER,
} from "../constants/transaction.constants";
import { getDateRangeFromPreset, useTransactionFilters } from "./useTransactionFilters";

describe("useTransactionFilters", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("initializes with default filter state", () => {
    const { result } = renderHook(() => useTransactionFilters());

    expect(result.current.searchInput).toBe("");
    expect(result.current.status).toBe(TRANSACTION_STATUS_FILTER.ALL);
    expect(result.current.method).toBe(PAYMENT_METHOD_FILTER.ALL);
    expect(result.current.datePreset).toBe(DATE_PRESET_OPTIONS.ALL);
    expect(result.current.page).toBe(1);
    expect(result.current.limit).toBe(20);
    expect(result.current.isFiltered).toBe(false);
  });

  it("debounces search input updates by 300ms and resets page to 1", () => {
    const { result } = renderHook(() => useTransactionFilters());

    act(() => {
      result.current.setPage(3);
    });
    expect(result.current.page).toBe(3);

    act(() => {
      result.current.setSearchInput("SQ-98214");
    });

    expect(result.current.queryParams.search).toBeUndefined();

    // Fast-forward debounce timer
    act(() => {
      jest.advanceTimersByTime(300);
    });

    expect(result.current.queryParams.search).toBe("SQ-98214");
    expect(result.current.page).toBe(1);
    expect(result.current.isFiltered).toBe(true);
  });

  it("updates status and resets page to 1", () => {
    const { result } = renderHook(() => useTransactionFilters());

    act(() => {
      result.current.setPage(4);
      result.current.handleStatusChange(TRANSACTION_STATUS_FILTER.SUCCESS);
    });

    expect(result.current.status).toBe(TRANSACTION_STATUS_FILTER.SUCCESS);
    expect(result.current.queryParams.status).toBe(TRANSACTION_STATUS_FILTER.SUCCESS);
    expect(result.current.page).toBe(1);
    expect(result.current.isFiltered).toBe(true);
  });

  it("updates payment method and resets page to 1", () => {
    const { result } = renderHook(() => useTransactionFilters());

    act(() => {
      result.current.handleMethodChange(PAYMENT_METHOD_FILTER.UPI);
    });

    expect(result.current.method).toBe(PAYMENT_METHOD_FILTER.UPI);
    expect(result.current.queryParams.method).toBe(PAYMENT_METHOD_FILTER.UPI);
    expect(result.current.isFiltered).toBe(true);
  });

  it("calculates date ranges accurately for presets", () => {
    const today = getDateRangeFromPreset(DATE_PRESET_OPTIONS.TODAY);
    expect(today.startDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(today.startDate).toBe(today.endDate);

    const yesterday = getDateRangeFromPreset(DATE_PRESET_OPTIONS.YESTERDAY);
    expect(yesterday.startDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);

    const last7 = getDateRangeFromPreset(DATE_PRESET_OPTIONS.LAST_7_DAYS);
    expect(last7.startDate).toBeDefined();
    expect(last7.endDate).toBeDefined();
  });

  it("resets all filters to default state when resetFilters is called", () => {
    const { result } = renderHook(() => useTransactionFilters());

    act(() => {
      result.current.setSearchInput("Rahul");
      result.current.handleStatusChange(TRANSACTION_STATUS_FILTER.FAILED);
      result.current.handleMethodChange(PAYMENT_METHOD_FILTER.CARD);
      result.current.handleDatePresetChange(DATE_PRESET_OPTIONS.TODAY);
      result.current.setPage(5);
    });

    act(() => {
      jest.advanceTimersByTime(300);
    });

    expect(result.current.isFiltered).toBe(true);

    act(() => {
      result.current.resetFilters();
    });

    expect(result.current.searchInput).toBe("");
    expect(result.current.status).toBe(TRANSACTION_STATUS_FILTER.ALL);
    expect(result.current.method).toBe(PAYMENT_METHOD_FILTER.ALL);
    expect(result.current.datePreset).toBe(DATE_PRESET_OPTIONS.ALL);
    expect(result.current.page).toBe(1);
    expect(result.current.isFiltered).toBe(false);
  });

  it("identifies invalid date range when customStartDate is after customEndDate and prevents sending to queryParams", () => {
    const { result } = renderHook(() => useTransactionFilters());

    act(() => {
      result.current.handleCustomStartDateChange("2026-11-05");
      result.current.handleCustomEndDateChange("2026-11-01");
    });

    expect(result.current.isDateRangeInvalid).toBe(true);
    expect(result.current.queryParams.startDate).toBeUndefined();
    expect(result.current.queryParams.endDate).toBeUndefined();
  });
});
