import { act, renderHook } from "@testing-library/react";
import { toast } from "sonner";
import { subscriptionApi } from "@/features/subscription/api/subscription.api";
import { useRazorpayCheckout } from "./useRazorpayCheckout";

jest.mock("sonner", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
    info: jest.fn(),
  },
}));

jest.mock("@/features/subscription/api/subscription.api", () => ({
  subscriptionApi: {
    createOrder: jest.fn(),
    verifyPayment: jest.fn(),
  },
}));

describe("useRazorpayCheckout", () => {
  let mockOpen: jest.Mock;
  let mockRazorpayConstructor: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    mockOpen = jest.fn();
    mockRazorpayConstructor = jest.fn().mockImplementation((options) => ({
      open: mockOpen,
      options,
    }));
    window.Razorpay = mockRazorpayConstructor as unknown as typeof window.Razorpay;
  });

  afterEach(() => {
    delete (window as { Razorpay?: unknown }).Razorpay;
  });

  it("initiates Razorpay checkout when startCheckout is called", async () => {
    const mockOrder = {
      orderId: "order_xyz",
      amount: 149900,
      currency: "INR",
      keyId: "rzp_test_123",
      plan: { id: "plan-1", name: "Queue Pro", code: "QUEUE_PRO" },
      restaurant: { name: "Tasty Restaurant", email: "test@res.com", phone: "9876543210" },
    };

    (subscriptionApi.createOrder as jest.Mock).mockResolvedValue(mockOrder);

    const { result } = renderHook(() => useRazorpayCheckout());

    await act(async () => {
      await result.current.startCheckout("plan-1");
    });

    expect(subscriptionApi.createOrder).toHaveBeenCalledWith("plan-1");
    expect(mockRazorpayConstructor).toHaveBeenCalledWith(
      expect.objectContaining({
        key: "rzp_test_123",
        amount: 149900,
        currency: "INR",
        order_id: "order_xyz",
      }),
    );
    expect(mockOpen).toHaveBeenCalled();
  });

  it("handles payment success and verifies signature", async () => {
    const mockOrder = {
      orderId: "order_xyz",
      amount: 149900,
      currency: "INR",
      keyId: "rzp_test_123",
      plan: { id: "plan-1", name: "Queue Pro", code: "QUEUE_PRO" },
      restaurant: { name: "Tasty Restaurant", email: "test@res.com", phone: "9876543210" },
    };

    const mockVerification = {
      subscriptionId: "sub_1",
      restaurantId: "res_1",
      planCode: "QUEUE_PRO",
      status: "ACTIVE",
      currentPeriodStart: "2026-09-01T00:00:00Z",
      currentPeriodEnd: "2026-10-01T00:00:00Z",
    };

    (subscriptionApi.createOrder as jest.Mock).mockResolvedValue(mockOrder);
    (subscriptionApi.verifyPayment as jest.Mock).mockResolvedValue(mockVerification);

    const onSuccess = jest.fn();
    const { result } = renderHook(() => useRazorpayCheckout({ onSuccess }));

    await act(async () => {
      await result.current.startCheckout("plan-1");
    });

    const passedOptions = mockRazorpayConstructor.mock.calls[0][0];

    // Simulate Razorpay calling the success handler
    await act(async () => {
      await passedOptions.handler({
        razorpay_order_id: "order_xyz",
        razorpay_payment_id: "pay_xyz",
        razorpay_signature: "sig_xyz",
      });
    });

    expect(subscriptionApi.verifyPayment).toHaveBeenCalledWith({
      razorpayOrderId: "order_xyz",
      razorpayPaymentId: "pay_xyz",
      razorpaySignature: "sig_xyz",
    });
    expect(toast.success).toHaveBeenCalledWith(expect.stringContaining("Subscription activated"));
    expect(onSuccess).toHaveBeenCalledWith(mockVerification);
  });

  it("handles modal ondismiss", async () => {
    const mockOrder = {
      orderId: "order_xyz",
      amount: 149900,
      currency: "INR",
      keyId: "rzp_test_123",
      plan: { id: "plan-1", name: "Queue Pro", code: "QUEUE_PRO" },
      restaurant: { name: "Tasty Restaurant" },
    };

    (subscriptionApi.createOrder as jest.Mock).mockResolvedValue(mockOrder);

    const { result } = renderHook(() => useRazorpayCheckout());

    await act(async () => {
      await result.current.startCheckout("plan-1");
    });

    const passedOptions = mockRazorpayConstructor.mock.calls[0][0];

    act(() => {
      passedOptions.modal.ondismiss();
    });

    expect(toast.info).toHaveBeenCalledWith(expect.stringContaining("closed"));
    expect(result.current.isProcessing).toBe(false);
  });

  it("handles script load failure gracefully", async () => {
    delete (window as { Razorpay?: unknown }).Razorpay;
    const onError = jest.fn();
    const { result } = renderHook(() => useRazorpayCheckout({ onError }));

    // Mock document.createElement to trigger onerror on script
    const originalCreateElement = document.createElement.bind(document);
    jest.spyOn(document, "createElement").mockImplementation((tagName: string) => {
      const el = originalCreateElement(tagName);
      if (tagName === "script") {
        setTimeout(() => {
          el.onerror?.(new Event("error") as unknown as Event);
        }, 0);
      }
      return el;
    });

    await act(async () => {
      await result.current.startCheckout("plan-1");
    });

    expect(toast.error).toHaveBeenCalled();
    expect(onError).toHaveBeenCalled();
    expect(result.current.isProcessing).toBe(false);

    (document.createElement as unknown as jest.Mock).mockRestore();
  });
});
