import { act, renderHook } from "@testing-library/react";
import { useElapsedTimer } from "./use-elapsed-timer";

describe("useElapsedTimer", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("returns default values when timestamp is missing or null", () => {
    const { result } = renderHook(() => useElapsedTimer(null));

    expect(result.current.formattedElapsed).toBe("0m 0s");
    expect(result.current.totalMinutes).toBe(0);
    expect(result.current.urgency).toBe("normal");
  });

  it("calculates normal urgency when elapsed time is under 15 minutes", () => {
    const now = Date.now();
    jest.setSystemTime(now);

    // 5 minutes and 20 seconds ago
    const pastTime = new Date(now - (5 * 60 + 20) * 1000).toISOString();

    const { result } = renderHook(() => useElapsedTimer(pastTime));

    expect(result.current.formattedElapsed).toBe("5m 20s");
    expect(result.current.totalMinutes).toBe(5);
    expect(result.current.urgency).toBe("normal");
  });

  it("calculates warning urgency when elapsed time is between 15 and 30 minutes", () => {
    const now = Date.now();
    jest.setSystemTime(now);

    // 18 minutes ago
    const pastTime = new Date(now - 18 * 60 * 1000).toISOString();

    const { result } = renderHook(() => useElapsedTimer(pastTime));

    expect(result.current.formattedElapsed).toBe("18m 0s");
    expect(result.current.totalMinutes).toBe(18);
    expect(result.current.urgency).toBe("warning");
  });

  it("calculates critical urgency when elapsed time exceeds 30 minutes", () => {
    const now = Date.now();
    jest.setSystemTime(now);

    // 35 minutes ago
    const pastTime = new Date(now - 35 * 60 * 1000).toISOString();

    const { result } = renderHook(() => useElapsedTimer(pastTime));

    expect(result.current.formattedElapsed).toBe("35m 0s");
    expect(result.current.totalMinutes).toBe(35);
    expect(result.current.urgency).toBe("critical");
  });

  it("formats hours and minutes when elapsed exceeds 1 hour", () => {
    const now = Date.now();
    jest.setSystemTime(now);

    // 1 hour and 15 minutes ago
    const pastTime = new Date(now - (75 * 60) * 1000).toISOString();

    const { result } = renderHook(() => useElapsedTimer(pastTime));

    expect(result.current.formattedElapsed).toBe("1h 15m");
    expect(result.current.urgency).toBe("critical");
  });

  it("ticks and updates every second", () => {
    const now = Date.now();
    jest.setSystemTime(now);

    const pastTime = new Date(now - 10 * 1000).toISOString(); // 10s ago
    const { result } = renderHook(() => useElapsedTimer(pastTime));

    expect(result.current.formattedElapsed).toBe("0m 10s");

    act(() => {
      jest.advanceTimersByTime(2000);
    });

    expect(result.current.formattedElapsed).toBe("0m 12s");
  });
});
