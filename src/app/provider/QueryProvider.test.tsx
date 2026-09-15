import { render, screen } from "@testing-library/react";
import QueryProvider, { shouldRetryQuery } from "./QueryProvider";

describe("QueryProvider retry policy", () => {
  describe("shouldRetryQuery", () => {
    it.each([401, 403, 404, 422])(
      "returns false on HTTP %i status code regardless of failure count",
      (status) => {
        const error = { response: { status } };
        expect(shouldRetryQuery(0, error)).toBe(false);
        expect(shouldRetryQuery(1, error)).toBe(false);
      },
    );

    it.each([500, 502, 503, 504])("retries up to 2 times for server errors (%i)", (status) => {
      const error = { response: { status } };
      expect(shouldRetryQuery(0, error)).toBe(true);
      expect(shouldRetryQuery(1, error)).toBe(true);
      expect(shouldRetryQuery(2, error)).toBe(false);
      expect(shouldRetryQuery(3, error)).toBe(false);
    });

    it("retries up to 2 times for generic network or unknown errors", () => {
      const networkError = new Error("Network request failed");
      expect(shouldRetryQuery(0, networkError)).toBe(true);
      expect(shouldRetryQuery(1, networkError)).toBe(true);
      expect(shouldRetryQuery(2, networkError)).toBe(false);
    });

    it("retries up to 2 times when error has no response property", () => {
      expect(shouldRetryQuery(0, null)).toBe(true);
      expect(shouldRetryQuery(1, {})).toBe(true);
      expect(shouldRetryQuery(2, {})).toBe(false);
    });
  });

  describe("QueryProvider component", () => {
    it("renders child elements successfully", () => {
      render(
        <QueryProvider>
          <div>Test Child Content</div>
        </QueryProvider>,
      );
      expect(screen.getByText("Test Child Content")).toBeInTheDocument();
    });
  });
});
