import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { subscriptionService } from "@/features/subscription/services/subscription.service";
import RestaurantDashboardPage from "./RestaurantDashboardPage";

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

jest.mock("@/features/subscription/services/subscription.service", () => ({
  subscriptionService: {
    fetchRestaurantStatus: jest.fn(),
  },
  subscriptionApi: {
    fetchRestaurantStatus: jest.fn(),
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

describe("RestaurantDashboardPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("redirects to subscription page when approved but subscription is inactive", async () => {
    (subscriptionService.fetchRestaurantStatus as jest.Mock).mockResolvedValueOnce({
      restaurantId: "123",
      restaurantName: "Test Kitchen",
      email: "test@spotq.com",
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
      email: "test@spotq.com",
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
      email: "test@spotq.com",
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

  it("renders expiring soon warning banner when subscription ends within 7 days", async () => {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 3);

    (subscriptionService.fetchRestaurantStatus as jest.Mock).mockResolvedValueOnce({
      restaurantId: "123",
      restaurantName: "Test Kitchen",
      email: "test@spotq.com",
      verificationStatus: "APPROVED",
      isSubscriptionActive: true,
      subscriptionPlanCode: "QUEUE_PRO",
      subscriptionEndsAt: futureDate.toISOString(),
    });

    renderWithClient(<RestaurantDashboardPage />);

    await waitFor(() => {
      expect(screen.getByText("Subscription Expiring Soon")).toBeInTheDocument();
      expect(screen.getByText(/expires in 3 days/i)).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /Renew Plan/i })).toBeInTheDocument();
    });
  });
});
