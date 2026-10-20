import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import type React from "react";
import { MOCK_ORDER_RECEIPT } from "../mocks/order-receipt.mock";
import { orderService } from "../services/order.service";
import { useOrderReceipt } from "./use-order-receipt";

jest.mock("../services/order.service", () => ({
  orderService: {
    getOrderReceipt: jest.fn(),
  },
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe("useOrderReceipt hook", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("fetches receipt data successfully for a given orderId", async () => {
    (orderService.getOrderReceipt as jest.Mock).mockResolvedValue(MOCK_ORDER_RECEIPT);

    const { result } = renderHook(() => useOrderReceipt("ord_992817203"), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(orderService.getOrderReceipt).toHaveBeenCalledWith("ord_992817203");
    expect(result.current.data?.restaurant.name).toBe("Spice Garden Cafe");
    expect(result.current.data?.total_amount).toBe(863);
  });

  it("does not fetch if orderId is missing", () => {
    const { result } = renderHook(() => useOrderReceipt(null), {
      wrapper: createWrapper(),
    });

    expect(result.current.fetchStatus).toBe("idle");
    expect(orderService.getOrderReceipt).not.toHaveBeenCalled();
  });
});
