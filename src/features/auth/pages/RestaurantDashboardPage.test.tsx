import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { subscriptionApi } from "@/features/subscription/api/subscription.api";
import RestaurantDashboardPage from "./RestaurantDashboardPage";

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

jest.mock("@/features/subscription/api/subscription.api", () => ({
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
    (subscriptionApi.fetchRestaurantStatus as jest.Mock).mockResolvedValueOnce({
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

  it("renders active dashboard without redirect when subscription is active", async () => {
    (subscriptionApi.fetchRestaurantStatus as jest.Mock).mockResolvedValueOnce({
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

    (subscriptionApi.fetchRestaurantStatus as jest.Mock).mockResolvedValueOnce({
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
