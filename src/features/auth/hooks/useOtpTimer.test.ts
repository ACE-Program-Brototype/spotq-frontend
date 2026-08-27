import { act, renderHook } from "@testing-library/react";
import { useOtpTimer } from "./useOtpTimer";

describe("useOtpTimer", () => {
  beforeEach(() => {
    localStorage.clear();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("initializes with default countdown duration and saves expiry to localStorage", () => {
    const { result } = renderHook(() =>
      useOtpTimer({ email: "test@example.com", defaultSeconds: 60 }),
    );

    expect(result.current.seconds).toBe(60);
    expect(result.current.isExpired).toBe(false);

    const stored = localStorage.getItem("spotq_otp_expiry_test@example.com");
    expect(stored).not.toBeNull();
  });

  it("decrements timer as time passes", () => {
    const { result } = renderHook(() =>
      useOtpTimer({ email: "test@example.com", defaultSeconds: 60 }),
    );

    act(() => {
      jest.advanceTimersByTime(5000);
    });

    expect(result.current.seconds).toBe(55);
    expect(result.current.isExpired).toBe(false);
  });

  it("recovers remaining seconds from existing localStorage expiry on mount", () => {
    const futureExpiry = Date.now() + 30 * 1000;
    localStorage.setItem("spotq_otp_expiry_test@example.com", String(futureExpiry));

    const { result } = renderHook(() =>
      useOtpTimer({ email: "test@example.com", defaultSeconds: 60 }),
    );

    expect(result.current.seconds).toBe(30);
  });

  it("resets timer with startTimer()", () => {
    const { result } = renderHook(() =>
      useOtpTimer({ email: "test@example.com", defaultSeconds: 60 }),
    );

    act(() => {
      jest.advanceTimersByTime(20000);
    });

    expect(result.current.seconds).toBe(40);

    act(() => {
      result.current.startTimer(60);
    });

    expect(result.current.seconds).toBe(60);
  });

  it("clears timer with resetTimer()", () => {
    const { result } = renderHook(() =>
      useOtpTimer({ email: "test@example.com", defaultSeconds: 60 }),
    );

    act(() => {
      result.current.resetTimer();
    });

    expect(result.current.seconds).toBe(0);
    expect(result.current.isExpired).toBe(true);
    expect(localStorage.getItem("spotq_otp_expiry_test@example.com")).toBeNull();
  });
});
