import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { SUBSCRIPTION_SUCCESS_TEXTS } from "@/features/subscription/constants/subscription.constants";
import { subscriptionService } from "@/features/subscription/services/subscription.service";
import SubscriptionSuccessPage from "./SubscriptionSuccessPage";

jest.mock("@/features/subscription/services/subscription.service", () => ({
  subscriptionService: {
    fetchRestaurantStatus: jest.fn(),
  },
}));

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

describe("SubscriptionSuccessPage", () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    jest.clearAllMocks();
    useAuthStore.getState().setUser({
      _id: "res-1",
      name: "Spice Garden",
      email: "spice@example.com",
      status: "APPROVED",
    });

    (subscriptionService.fetchRestaurantStatus as jest.Mock).mockResolvedValue({
      restaurantId: "res-1",
      restaurantName: "Spice Garden",
      verificationStatus: "APPROVED",
      isSubscriptionActive: true,
      subscriptionPlanCode: "QUEUE_PRO",
      subscriptionEndsAt: "2027-09-13T00:00:00.000Z",
      navigationTarget: "/restaurant/dashboard",
    });

    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
      },
    });
  });

  const renderComponentWithState = (initialState?: Record<string, unknown>) =>
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter
          initialEntries={[
            {
              pathname: "/restaurant/subscription/success",
              state: initialState,
            },
          ]}
        >
          <Routes>
            <Route path="/restaurant/subscription/success" element={<SubscriptionSuccessPage />} />
          </Routes>
        </MemoryRouter>
      </QueryClientProvider>,
    );

  it("renders success title, plan details, and active status from location state", () => {
    renderComponentWithState({
      planCode: "SELF_SERVICE_PRO",
      planName: "Self-Service Pro",
      periodEnd: "2027-10-01T00:00:00.000Z",
    });

    expect(screen.getByText(SUBSCRIPTION_SUCCESS_TEXTS.TITLE)).toBeInTheDocument();
    expect(screen.getByText(SUBSCRIPTION_SUCCESS_TEXTS.SUBTITLE)).toBeInTheDocument();
    expect(screen.getByText("Self-Service Pro")).toBeInTheDocument();
    expect(
      screen.getAllByText(SUBSCRIPTION_SUCCESS_TEXTS.ACTIVE_BADGE).length,
    ).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(SUBSCRIPTION_SUCCESS_TEXTS.FEATURE_QUEUE)).toBeInTheDocument();
    expect(screen.getByText(SUBSCRIPTION_SUCCESS_TEXTS.FEATURE_QR)).toBeInTheDocument();
  });

  it("falls back to status query when location state is not provided", async () => {
    renderComponentWithState(undefined);

    expect(screen.getByText(SUBSCRIPTION_SUCCESS_TEXTS.TITLE)).toBeInTheDocument();
    expect(await screen.findByText("Queue Pro")).toBeInTheDocument();
  });

  it("navigates to dashboard when Go to Dashboard is clicked", () => {
    renderComponentWithState({
      planCode: "QUEUE_PRO",
    });

    const dashboardBtn = screen.getByRole("button", {
      name: new RegExp(SUBSCRIPTION_SUCCESS_TEXTS.DASHBOARD_BUTTON, "i"),
    });
    fireEvent.click(dashboardBtn);

    expect(mockNavigate).toHaveBeenCalledWith("/restaurant/dashboard", { replace: true });
  });

  it("navigates to staff management when Manage Staff is clicked", () => {
    renderComponentWithState({
      planCode: "QUEUE_PRO",
    });

    const staffBtn = screen.getByRole("button", {
      name: new RegExp(SUBSCRIPTION_SUCCESS_TEXTS.STAFF_BUTTON, "i"),
    });
    fireEvent.click(staffBtn);

    expect(mockNavigate).toHaveBeenCalledWith("/restaurant/staff");
  });
});
