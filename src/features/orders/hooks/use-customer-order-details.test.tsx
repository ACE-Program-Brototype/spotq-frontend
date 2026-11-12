import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import type React from "react";
import { orderService } from "../services/order.service";
import type { CustomerOrderDetails } from "../types/customer-order-details.types";
import { useCustomerOrderDetails } from "./use-customer-order-details";

const mockOrderDetails: CustomerOrderDetails = {
  order_id: "220e777c-69b4-4c56-a0fe-b9e276678322",
  order_number: "ORD-MWAOYWC4-D83312",
  restaurant: {
    restaurant_id: "3dc35af0-3ff5-4ee9-a60a-fbb47124731b",
    name: "Al-Reem",
  },
  order_type: "QUEUE_ORDER",
  status: "CONFIRMED",
  created_at: "2026-11-10T12:54:05.621Z",
  updated_at: "2026-11-10T12:54:34.497Z",
  table_number: null,
  queue_entry_id: "1f662c4a-d484-4e35-ad79-da6c3642df71",
  special_instructions: "Extra crispy please",
  items: [
    {
      menu_item_id: "2f04e02b-7194-47cb-91f0-fa336cb3498e",
      name: "Chicken Biriyani",
      quantity: 2,
      unit_price: 180,
      variant: {
        variant_id: "deaf7aa6-fa00-43ac-afff-e277c7a8c19c",
        name: "Regular (1 Person)",
      },
      addons: [
        {
          addon_id: "addon-1",
          name: "Extra Raita",
          price: 20,
        },
      ],
      line_total: 400,
    },
  ],
  pricing: {
    subtotal: 360,
    discounts: 0,
    taxes: 18,
    platform_fee: 0,
    grand_total: 378,
    currency: "INR",
  },
  payment: {
    status: "PAID",
    method: "ONLINE",
    payment_id: "pay_982319238",
    amount_paid: 378,
  },
  status_history: [
    {
      previous_status: null,
      current_status: "PLACED",
      notes: "Order placed by customer",
      created_at: "2026-11-10T12:54:05.620Z",
    },
    {
      previous_status: "PLACED",
      current_status: "CONFIRMED",
      notes: "Payment captured via gateway",
      created_at: "2026-11-10T12:54:34.545Z",
    },
  ],
};

jest.mock("../services/order.service", () => ({
  orderService: {
    getCustomerOrderDetails: jest.fn(),
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

describe("useCustomerOrderDetails hook", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("fetches order details successfully for a valid orderId", async () => {
    (orderService.getCustomerOrderDetails as jest.Mock).mockResolvedValue(mockOrderDetails);

    const { result } = renderHook(
      () => useCustomerOrderDetails("220e777c-69b4-4c56-a0fe-b9e276678322"),
      {
        wrapper: createWrapper(),
      },
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true), {
      timeout: 5000,
    });

    expect(orderService.getCustomerOrderDetails).toHaveBeenCalledWith(
      "220e777c-69b4-4c56-a0fe-b9e276678322",
    );
    expect(result.current.data?.restaurant.name).toBe("Al-Reem");
    expect(result.current.data?.order_number).toBe("ORD-MWAOYWC4-D83312");
    expect(result.current.data?.payment.status).toBe("PAID");
  });

  it("does not fetch if orderId is missing or falsy", () => {
    const { result } = renderHook(() => useCustomerOrderDetails(""), {
      wrapper: createWrapper(),
    });

    expect(result.current.fetchStatus).toBe("idle");
    expect(orderService.getCustomerOrderDetails).not.toHaveBeenCalled();
  });

  it("handles error when fetch fails", async () => {
    (orderService.getCustomerOrderDetails as jest.Mock).mockRejectedValue(
      new Error("Network Error"),
    );

    const { result } = renderHook(() => useCustomerOrderDetails("error-id"), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isError).toBe(true), {
      timeout: 5000,
    });

    expect(result.current.error?.message).toBe("Network Error");
  });
});
