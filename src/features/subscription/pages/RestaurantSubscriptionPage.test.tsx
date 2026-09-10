import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { subscriptionApi } from "@/features/subscription/services/subscription.service";
import RestaurantSubscriptionPage from "./RestaurantSubscriptionPage";

jest.mock("@/features/subscription/services/subscription.service", () => ({
  subscriptionApi: {
    fetchPlans: jest.fn(),
    createOrder: jest.fn(),
    verifyPayment: jest.fn(),
  },
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
      code: "SELF_SERVICE_PRO",
      name: "Self-Service Pro",
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
    (subscriptionApi.fetchPlans as jest.Mock).mockResolvedValue(mockPlans);

    renderComponent();

    // Check verification notice
    expect(screen.getByText("Restaurant Verification Approved!")).toBeInTheDocument();
    expect(screen.getByText("Choose the right plan for your restaurant")).toBeInTheDocument();

    // Wait for plans to load
    await waitFor(() => {
      expect(screen.getByText("Queue Pro")).toBeInTheDocument();
      expect(screen.getByText("Self-Service Pro")).toBeInTheDocument();
      expect(screen.getByText("₹1,499")).toBeInTheDocument();
      expect(screen.getByText("₹2,500")).toBeInTheDocument();
    });

    // Check value props
    expect(screen.getByText("Instant Activation")).toBeInTheDocument();
    expect(screen.getByText("100% Secure Checkout")).toBeInTheDocument();
  });

  it("renders error state when fetching plans fails and allows retry", async () => {
    (subscriptionApi.fetchPlans as jest.Mock).mockRejectedValueOnce(new Error("Network Error"));

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText("Failed to load subscription plans")).toBeInTheDocument();
      expect(screen.getByText("Network Error")).toBeInTheDocument();
    });

    (subscriptionApi.fetchPlans as jest.Mock).mockResolvedValue(mockPlans);

    const retryBtn = screen.getByRole("button", { name: /Retry Loading Plans/i });
    fireEvent.click(retryBtn);

    await waitFor(() => {
      expect(screen.getByText("Queue Pro")).toBeInTheDocument();
    });
  });
});
