import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { subscriptionService } from "@/features/subscription/services/subscription.service";
import type { VerifyPaymentResponse } from "@/features/subscription/types/subscription.types";
import RestaurantSubscriptionPage from "./RestaurantSubscriptionPage";

jest.mock("@/features/subscription/services/subscription.service", () => ({
  subscriptionService: {
    fetchPlans: jest.fn(),
    createOrder: jest.fn(),
    verifyPayment: jest.fn(),
    fetchRestaurantStatus: jest.fn(),
  },
  subscriptionApi: {
    fetchPlans: jest.fn(),
    createOrder: jest.fn(),
    verifyPayment: jest.fn(),
    fetchRestaurantStatus: jest.fn(),
  },
}));

let capturedCheckoutOptions: {
  onSuccess?: (result: VerifyPaymentResponse) => void;
  onError?: (err: Error) => void;
  onAlreadyActive?: () => void;
} = {};

jest.mock("@/features/subscription/hooks/useRazorpayCheckout", () => ({
  useRazorpayCheckout: jest.fn((options) => {
    capturedCheckoutOptions = options;
    return {
      startCheckout: jest.fn(),
      isProcessing: false,
      selectedPlanId: null,
    };
  }),
}));

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

describe("RestaurantSubscriptionPage", () => {
  let queryClient: QueryClient;

  const mockPlans = [
    {
      id: "plan-1",
      code: "QUEUE_PRO",
      name: "Queue Pro",
      description: "Manage walk-ins and queues",
      pricePaise: 149900,
      priceInRupees: 1499,
      currency: "INR",
      billingCycle: "MONTHLY" as const,
      features: ["Queue management", "SMS notifications"],
      isPopular: true,
    },
    {
      id: "plan-2",
      code: "SELF_PRO",
      name: "Self Pro",
      description: "Complete digital dining & QR ordering",
      pricePaise: 250000,
      priceInRupees: 2500,
      currency: "INR",
      billingCycle: "MONTHLY" as const,
      features: ["QR Menu & Ordering", "Queue + Self Service"],
      isPopular: false,
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    capturedCheckoutOptions = {};
    (subscriptionService.fetchRestaurantStatus as jest.Mock).mockResolvedValue(null);
    useAuthStore.getState().setUser({
      _id: "res-1",
      name: "Tasty Food",
      email: "tasty@example.com",
      role: "RESTAURANT_ADMIN",
      status: "APPROVED",
    });
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });
  });

  const renderComponent = () =>
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <RestaurantSubscriptionPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

  it("renders verification approval banner and subscription plans", async () => {
    (subscriptionService.fetchPlans as jest.Mock).mockResolvedValue(mockPlans);

    renderComponent();

    expect(screen.getByText("Restaurant Verification Approved!")).toBeInTheDocument();
    expect(screen.getByText("Choose the right plan for your restaurant")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("Queue Pro")).toBeInTheDocument();
      expect(screen.getByText("Self Pro")).toBeInTheDocument();
      expect(screen.getByText("₹1,499")).toBeInTheDocument();
      expect(screen.getByText("₹2,500")).toBeInTheDocument();
    });

    expect(screen.getByText("Instant Activation")).toBeInTheDocument();
    expect(screen.getByText("100% Secure Checkout")).toBeInTheDocument();
  });

  it("renders error state when fetching plans fails and allows retry", async () => {
    (subscriptionService.fetchPlans as jest.Mock).mockRejectedValueOnce(new Error("Network Error"));

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText("Failed to load subscription plans")).toBeInTheDocument();
      expect(screen.getByText("Network Error")).toBeInTheDocument();
    });

    (subscriptionService.fetchPlans as jest.Mock).mockResolvedValue(mockPlans);

    const retryBtn = screen.getByRole("button", { name: /Retry Loading Plans/i });
    fireEvent.click(retryBtn);

    await waitFor(() => {
      expect(screen.getByText("Queue Pro")).toBeInTheDocument();
    });
  });

  it("navigates to dashboard if user already has an active subscription on load", async () => {
    (subscriptionService.fetchRestaurantStatus as jest.Mock).mockResolvedValue({
      isSubscriptionActive: true,
      subscriptionPlanCode: "QUEUE_PRO",
    });
    (subscriptionService.fetchPlans as jest.Mock).mockResolvedValue(mockPlans);

    renderComponent();

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/restaurant/dashboard", { replace: true });
    });
  });

  it("navigates to subscription success page upon checkout success", async () => {
    (subscriptionService.fetchPlans as jest.Mock).mockResolvedValue(mockPlans);

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText("Queue Pro")).toBeInTheDocument();
    });

    // Simulate checkout success
    capturedCheckoutOptions.onSuccess?.({
      subscriptionId: "sub-123",
      restaurantId: "res-1",
      planCode: "QUEUE_PRO",
      status: "ACTIVE",
      currentPeriodStart: "2026-09-01T00:00:00Z",
      currentPeriodEnd: "2026-10-01T00:00:00Z",
    });

    expect(mockNavigate).toHaveBeenCalledWith("/restaurant/subscription/success", {
      replace: true,
      state: {
        planCode: "QUEUE_PRO",
        subscriptionId: "sub-123",
        periodEnd: "2026-10-01T00:00:00Z",
      },
    });

    // Verify it was NOT redirected to dashboard
    expect(mockNavigate).not.toHaveBeenCalledWith("/restaurant/dashboard", { replace: true });
  });

  it("navigates to subscription failure page upon checkout error", async () => {
    (subscriptionService.fetchPlans as jest.Mock).mockResolvedValue(mockPlans);

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText("Queue Pro")).toBeInTheDocument();
    });

    // Simulate checkout error
    capturedCheckoutOptions.onError?.(new Error("Payment verification failed"));

    expect(mockNavigate).toHaveBeenCalledWith("/restaurant/subscription/failure", {
      replace: true,
      state: {
        errorMessage: "Payment verification failed",
      },
    });
  });
});
