import { act, renderHook } from "@testing-library/react";
import { useDebounce } from "./use-debounce";

describe("useDebounce", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("returns initial value immediately", () => {
    const { result } = renderHook(() => useDebounce("initial", 400));
    expect(result.current).toBe("initial");
  });

  it("debounces value updates until timer expires", () => {
    const { result, rerender } = renderHook(({ value, delay }) => useDebounce(value, delay), {
      initialProps: { value: "first", delay: 400 },
    });

    expect(result.current).toBe("first");

    rerender({ value: "second", delay: 400 });
    // Should still have old value before timer
    expect(result.current).toBe("first");

    act(() => {
      jest.advanceTimersByTime(200);
    });
    expect(result.current).toBe("first");

    act(() => {
      jest.advanceTimersByTime(200);
    });
    expect(result.current).toBe("second");
  });
});
