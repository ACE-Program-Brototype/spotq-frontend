import { apiClient } from "@/lib/api/client";
import { MOCK_ORDER_RECEIPT } from "../mocks/order-receipt.mock";
import { orderService } from "./order.service";

jest.mock("@/lib/api/client", () => ({
  apiClient: {
    get: jest.fn(),
  },
}));

describe("orderService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns live order receipt data when API succeeds", async () => {
    const mockApiResponse = {
      success: true,
      data: {
        ...MOCK_ORDER_RECEIPT,
        order_id: "ord_live_123",
      },
    };

    (apiClient.get as jest.Mock).mockReturnValue({
      json: jest.fn().mockResolvedValue(mockApiResponse),
    });

    const result = await orderService.getOrderReceipt("ord_live_123");

    expect(apiClient.get).toHaveBeenCalledWith("orders/ord_live_123");
    expect(result.order_id).toBe("ord_live_123");
    expect(result.restaurant.name).toBe("Spice Garden Cafe");
  });

  it("falls back to mock data when API call fails for known mock orderId", async () => {
    (apiClient.get as jest.Mock).mockReturnValue({
      json: jest.fn().mockRejectedValue(new Error("404 Not Found")),
    });

    const result = await orderService.getOrderReceipt("ord_992817203");

    expect(result.order_id).toBe("ord_992817203");
    expect(result.status).toBe("COMPLETED");
    expect(result.total_amount).toBe(863);
  });

  it("throws error when API fails for unknown random orderId", async () => {
    (apiClient.get as jest.Mock).mockReturnValue({
      json: jest.fn().mockRejectedValue(new Error("404 Not Found")),
    });

    await expect(orderService.getOrderReceipt("random")).rejects.toThrow("404 Not Found");
  });
});
