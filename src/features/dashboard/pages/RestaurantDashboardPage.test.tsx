import { subscriptionService } from "@features/subscription/services/subscription.service";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import RestaurantDashboardPage from "./RestaurantDashboardPage";

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

jest.mock("sonner", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
    info: jest.fn(),
  },
}));

jest.mock("@features/subscription/services/subscription.service", () => ({
  subscriptionService: {
    fetchRestaurantStatus: jest.fn(),
    fetchPlans: jest.fn(),
    renewSubscription: jest.fn(),
    verifyPayment: jest.fn(),
  },
  subscriptionApi: {
    fetchRestaurantStatus: jest.fn(),
    fetchPlans: jest.fn(),
    renewSubscription: jest.fn(),
    verifyPayment: jest.fn(),
  },
}));

function renderWithClient(ui: React.ReactElement) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>{ui}</MemoryRouter>
    </QueryClientProvider>,
  );
}

const MOCK_PLANS = [
  {
    id: "plan-1",
    code: "QUEUE_PRO",
    name: "Queue Pro",
    pricePaise: 149900,
    priceInRupees: 1499,
    currency: "INR",
    billingCycle: "MONTHLY" as const,
    features: [],
  },
];

describe("RestaurantDashboardPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (subscriptionService.fetchPlans as jest.Mock).mockResolvedValue(MOCK_PLANS);
  });

  afterEach(() => {
    delete (window as { Razorpay?: unknown }).Razorpay;
  });

  it("redirects to subscription page when approved but subscription is inactive", async () => {
    (subscriptionService.fetchRestaurantStatus as jest.Mock).mockResolvedValueOnce({
      restaurantId: "123",
      restaurantName: "Test Kitchen",
      verificationStatus: "APPROVED",
      isSubscriptionActive: false,
    });

    renderWithClient(<RestaurantDashboardPage />);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/restaurant/subscription", { replace: true });
    });
  });

  it("redirects to subscription page when account status is ACTIVE in auth store but subscription is inactive", async () => {
    const { useAuthStore } = require("@/features/auth/store/auth.store");
    useAuthStore.setState({
      user: { email: "test@spotq.com", status: "ACTIVE" },
      isAuthenticated: true,
    });

    (subscriptionService.fetchRestaurantStatus as jest.Mock).mockResolvedValueOnce({
      restaurantId: "123",
      restaurantName: "Test Kitchen",
      verificationStatus: "PENDING",
      isSubscriptionActive: false,
    });

    renderWithClient(<RestaurantDashboardPage />);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/restaurant/subscription", { replace: true });
    });
  });

  it("renders active dashboard without redirect when subscription is active", async () => {
    (subscriptionService.fetchRestaurantStatus as jest.Mock).mockResolvedValueOnce({
      restaurantId: "123",
      restaurantName: "Test Kitchen",
      verificationStatus: "APPROVED",
      isSubscriptionActive: true,
      subscriptionPlanCode: "QUEUE_PRO",
    });

    renderWithClient(<RestaurantDashboardPage />);

    await waitFor(() => {
      expect(screen.getByText("Welcome, Test Kitchen")).toBeInTheDocument();
      expect(screen.getByText("QUEUE PRO")).toBeInTheDocument();
    });
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it("opens RenewalModal from expiry banner, refreshes status on confirmed renewal, and removes banner", async () => {
    const user = userEvent.setup();
    let razorpayHandler: ((res: Record<string, string>) => Promise<void>) | undefined;

    window.Razorpay = jest.fn().mockImplementation((options) => {
      razorpayHandler = options.handler;
      return {
        open: jest.fn(),
        on: jest.fn(),
      };
    }) as unknown as typeof window.Razorpay;

    const expiringDate = new Date(Date.now() + 3 * 86_400_000).toISOString();
    const renewedDate = new Date(Date.now() + 33 * 86_400_000).toISOString();

    (subscriptionService.fetchRestaurantStatus as jest.Mock)
      .mockResolvedValueOnce({
        restaurantId: "123",
        restaurantName: "Test Kitchen",
        verificationStatus: "APPROVED",
        isSubscriptionActive: true,
        subscriptionPlanCode: "QUEUE_PRO",
        subscriptionEndsAt: expiringDate,
        subscription: {
          id: "sub-123",
          status: "ACTIVE",
          planCode: "QUEUE_PRO",
          planName: "Queue Pro",
          currentPeriodStart: new Date().toISOString(),
          currentPeriodEnd: expiringDate,
        },
      })
      .mockResolvedValueOnce({
        restaurantId: "123",
        restaurantName: "Test Kitchen",
        verificationStatus: "APPROVED",
        isSubscriptionActive: true,
        subscriptionPlanCode: "QUEUE_PRO",
        subscriptionEndsAt: renewedDate,
        subscription: {
          id: "sub-123",
          status: "ACTIVE",
          planCode: "QUEUE_PRO",
          planName: "Queue Pro",
          currentPeriodStart: new Date().toISOString(),
          currentPeriodEnd: renewedDate,
        },
      });

    (subscriptionService.renewSubscription as jest.Mock).mockResolvedValueOnce({
      orderId: "order_renew_1",
      amount: 149900,
      currency: "INR",
      keyId: "rzp_test",
      plan: { id: "plan-1", name: "Queue Pro", code: "QUEUE_PRO" },
      subscription: {
        id: "sub-123",
        currentStatus: "ACTIVE",
        currentPeriodEnd: expiringDate,
        renewalWindowDays: 30,
        isRenewal: true,
      },
      restaurant: { name: "Test Kitchen", email: "test@spotq.com" },
    });

    (subscriptionService.verifyPayment as jest.Mock).mockResolvedValueOnce({
      subscriptionId: "sub-123",
      restaurantId: "123",
      planCode: "QUEUE_PRO",
      status: "ACTIVE",
      currentPeriodStart: new Date().toISOString(),
      currentPeriodEnd: renewedDate,
    });

    renderWithClient(<RestaurantDashboardPage />);

    const bannerRenewButton = await screen.findByTestId("banner-renew-now-button");
    expect(screen.getByText("Subscription Expiring Soon")).toBeInTheDocument();

    await user.click(bannerRenewButton);

    const continueButton = await screen.findByTestId("renewal-modal-continue-button");
    await user.click(continueButton);

    await waitFor(() => {
      expect(subscriptionService.renewSubscription).toHaveBeenCalledWith(
        "sub-123",
        "plan-1",
        expect.any(String),
      );
    });

    await act(async () => {
      await razorpayHandler?.({
        razorpay_order_id: "order_renew_1",
        razorpay_payment_id: "pay_renew_1",
        razorpay_signature: "sig_renew_1",
      });
    });

    await waitFor(() => {
      expect(screen.queryByTestId("subscription-expiry-banner")).not.toBeInTheDocument();
      expect(screen.queryByTestId("renewal-modal")).not.toBeInTheDocument();
    });
  });
});
