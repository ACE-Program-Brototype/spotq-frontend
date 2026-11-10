import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import type React from "react";
import { orderService } from "../services/order.service";
import type { OrderReceipt } from "../types/order-receipt.types";
import { useOrderReceipt } from "./use-order-receipt";

const mockReceipt: OrderReceipt = {
  order_id: "ord_992817203",
  order_number: "SQ-101",
  restaurant: {
    restaurant_id: "rest_65f2a1b9e12345",
    name: "Spice Garden Cafe",
  },
  status: "COMPLETED",
  items: [
    {
      menu_item_id: "item_pizza_01",
      name: "Margherita Pizza",
      variant_id: "var_large_12",
      variant_name: "Large (12 inch)",
      addons: [],
      quantity: 2,
      unit_price: 350.0,
      line_total: 820.0,
      special_instructions: null,
    },
  ],
  sub_total: 820.0,
  tax_amount: 41.0,
  platform_fee: 2.0,
  total_amount: 863.0,
  created_at: "2026-10-06T13:50:00.000Z",
};

jest.mock("../services/order.service", () => ({
  orderService: {
    getOrderReceipt: jest.fn(),
  },
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: Number.POSITIVE_INFINITY,
      },
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
    (orderService.getOrderReceipt as jest.Mock).mockResolvedValue(mockReceipt);

    const { result } = renderHook(() => useOrderReceipt("ord_992817203"), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true), {
      timeout: 5000,
    });

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
