import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook } from "@testing-library/react";
import type React from "react";
import { toast } from "sonner";
import { SUBSCRIPTION_QUERY_KEYS } from "@/features/subscription/constants/subscription.constants";
import { subscriptionService } from "@/features/subscription/services/subscription.service";
import { useSubscriptionRenewal } from "./useSubscriptionRenewal";

jest.mock("sonner", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
    info: jest.fn(),
  },
}));

jest.mock("@/features/subscription/services/subscription.service", () => ({
  subscriptionService: {
    renewSubscription: jest.fn(),
    verifyPayment: jest.fn(),
  },
}));

describe("useSubscriptionRenewal", () => {
  let mockOpen: jest.Mock;
  let mockOn: jest.Mock;
  let mockRazorpayConstructor: jest.Mock;
  let queryClient: QueryClient;

  function createWrapper() {
    queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    return ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  }

  beforeEach(() => {
    jest.clearAllMocks();
    mockOpen = jest.fn();
    mockOn = jest.fn();
    mockRazorpayConstructor = jest.fn().mockImplementation((options) => ({
      open: mockOpen,
      on: mockOn,
      options,
    }));
    window.Razorpay = mockRazorpayConstructor as unknown as typeof window.Razorpay;
  });

  afterEach(() => {
    delete (window as { Razorpay?: unknown }).Razorpay;
  });

  it("initiates renewal, verifies payment, and invalidates restaurant-status only after verification", async () => {
    const mockRenewalOrder = {
      orderId: "order_renew_1",
      amount: 149900,
      currency: "INR",
      keyId: "rzp_test_key",
      plan: { id: "plan-1", name: "Queue Pro", code: "QUEUE_PRO" },
      subscription: {
        id: "sub-1",
        currentStatus: "ACTIVE",
        currentPeriodEnd: "2026-11-05T00:00:00.000Z",
        renewalWindowDays: 30,
        isRenewal: true,
      },
      restaurant: { name: "SpotQ Kitchen", email: "owner@spotq.com" },
    };

    const mockVerified = {
      subscriptionId: "sub-1",
      restaurantId: "rest-1",
      planCode: "QUEUE_PRO",
      status: "ACTIVE",
      currentPeriodStart: "2026-10-05T00:00:00.000Z",
      currentPeriodEnd: "2026-12-05T00:00:00.000Z",
    };

    (subscriptionService.renewSubscription as jest.Mock).mockResolvedValue(mockRenewalOrder);
    (subscriptionService.verifyPayment as jest.Mock).mockResolvedValue(mockVerified);

    const onSuccess = jest.fn();
    const wrapper = createWrapper();
    const invalidateSpy = jest.spyOn(queryClient, "invalidateQueries");

    const { result } = renderHook(() => useSubscriptionRenewal({ onSuccess }), { wrapper });

    await act(async () => {
      await result.current.initiateRenewal("sub-1", "plan-1");
    });

    expect(subscriptionService.renewSubscription).toHaveBeenCalledWith(
      "sub-1",
      "plan-1",
      expect.any(String),
    );
    expect(mockOpen).toHaveBeenCalledTimes(1);
    expect(invalidateSpy).not.toHaveBeenCalled();

    const passedOptions = mockRazorpayConstructor.mock.calls[0][0];
    await act(async () => {
      await passedOptions.handler({
        razorpay_order_id: "order_renew_1",
        razorpay_payment_id: "pay_renew_1",
        razorpay_signature: "sig_renew_1",
      });
    });

    expect(subscriptionService.verifyPayment).toHaveBeenCalledWith({
      razorpayOrderId: "order_renew_1",
      razorpayPaymentId: "pay_renew_1",
      razorpaySignature: "sig_renew_1",
    });
    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: SUBSCRIPTION_QUERY_KEYS.RESTAURANT_STATUS,
    });
    expect(toast.success).toHaveBeenCalled();
    expect(onSuccess).toHaveBeenCalledWith(mockVerified);
  });

  it("prevents duplicate renewal submissions while request is in flight", async () => {
    let resolveRenewal: (value: unknown) => void = () => {};
    (subscriptionService.renewSubscription as jest.Mock).mockReturnValue(
      new Promise((resolve) => {
        resolveRenewal = resolve;
      }),
    );

    const { result } = renderHook(() => useSubscriptionRenewal(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      void result.current.initiateRenewal("sub-1", "plan-1");
      void result.current.initiateRenewal("sub-1", "plan-1");
      await Promise.resolve();
    });

    expect(subscriptionService.renewSubscription).toHaveBeenCalledTimes(1);

    await act(async () => {
      resolveRenewal({
        orderId: "order_1",
        amount: 149900,
        currency: "INR",
        keyId: "rzp_test",
        plan: { id: "plan-1", name: "Queue Pro", code: "QUEUE_PRO" },
        subscription: {
          id: "sub-1",
          currentStatus: "ACTIVE",
          currentPeriodEnd: "2026-11-05T00:00:00.000Z",
          renewalWindowDays: 30,
          isRenewal: true,
        },
        restaurant: {},
      });
    });
  });

  it("handles checkout cancellation without mutating subscription cache", async () => {
    (subscriptionService.renewSubscription as jest.Mock).mockResolvedValue({
      orderId: "order_1",
      amount: 149900,
      currency: "INR",
      keyId: "rzp_test",
      plan: { id: "plan-1", name: "Queue Pro", code: "QUEUE_PRO" },
      subscription: {
        id: "sub-1",
        currentStatus: "ACTIVE",
        currentPeriodEnd: "2026-11-05T00:00:00.000Z",
        renewalWindowDays: 30,
        isRenewal: true,
      },
      restaurant: {},
    });

    const wrapper = createWrapper();
    const invalidateSpy = jest.spyOn(queryClient, "invalidateQueries");
    const { result } = renderHook(() => useSubscriptionRenewal(), { wrapper });

    await act(async () => {
      await result.current.initiateRenewal("sub-1", "plan-1");
    });

    const passedOptions = mockRazorpayConstructor.mock.calls[0][0];
    act(() => {
      passedOptions.modal.ondismiss();
    });

    expect(result.current.isSubmitting).toBe(false);
    expect(invalidateSpy).not.toHaveBeenCalled();
    expect(toast.info).toHaveBeenCalled();
  });

  it("reuses the same Idempotency-Key on network retry for the same plan and rotates when planId changes", async () => {
    (subscriptionService.renewSubscription as jest.Mock)
      .mockRejectedValueOnce(new Error("Network timeout"))
      .mockRejectedValueOnce(new Error("Network timeout"))
      .mockRejectedValueOnce(new Error("Network timeout"));

    const { result } = renderHook(() => useSubscriptionRenewal(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      await result.current.initiateRenewal("sub-1", "plan-monthly");
    });
    const firstKey = (subscriptionService.renewSubscription as jest.Mock).mock.calls[0][2];

    await act(async () => {
      await result.current.initiateRenewal("sub-1", "plan-monthly");
    });
    const retryKey = (subscriptionService.renewSubscription as jest.Mock).mock.calls[1][2];

    expect(retryKey).toBe(firstKey);

    await act(async () => {
      await result.current.initiateRenewal("sub-1", "plan-yearly");
    });
    const rotatedKey = (subscriptionService.renewSubscription as jest.Mock).mock.calls[2][2];

    expect(rotatedKey).not.toBe(firstKey);
  });
});
