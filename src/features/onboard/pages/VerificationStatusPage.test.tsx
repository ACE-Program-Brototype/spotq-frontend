import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { getRestaurantVerificationStatus } from "@/features/auth/services/auth.service";
import { useAuthStore } from "@/features/auth/store/auth.store";
import VerificationStatusPage from "./VerificationStatusPage";

const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

jest.mock("@/features/auth/services/auth.service", () => ({
  getRestaurantVerificationStatus: jest.fn(),
}));

describe("VerificationStatusPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useAuthStore.getState().clearAuth();
    useAuthStore.getState().setUser({
      email: "test@restaurant.com",
      restaurantId: "res-123",
      role: "RESTAURANT_ADMIN",
    });
  });

  const renderComponent = () => {
    return render(
      <BrowserRouter>
        <VerificationStatusPage />
      </BrowserRouter>,
    );
  };

  it("renders UNDER_REVIEW state when API returns UNDER_REVIEW", async () => {
    (getRestaurantVerificationStatus as jest.Mock).mockResolvedValue({
      success: true,
      data: { status: "UNDER_REVIEW" },
    });

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText("Application Under Review")).toBeInTheDocument();
    });

    expect(screen.getByText("Verification Pending")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /check status/i })).toBeInTheDocument();
  });

  it("renders SUBMITTED state when API returns SUBMITTED", async () => {
    (getRestaurantVerificationStatus as jest.Mock).mockResolvedValue({
      success: true,
      data: { status: "SUBMITTED" },
    });

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText("Application Received")).toBeInTheDocument();
    });

    expect(screen.getAllByText("Application Submitted").length).toBeGreaterThan(0);
  });

  it("renders VERIFIED state and offers navigation to dashboard", async () => {
    jest.useFakeTimers();
    (getRestaurantVerificationStatus as jest.Mock).mockResolvedValue({
      success: true,
      data: { status: "VERIFIED" },
    });

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText("Application Approved!")).toBeInTheDocument();
    });

    expect(screen.getByText("Verified & Approved")).toBeInTheDocument();
    const dashboardBtn = screen.getByRole("button", { name: /go to restaurant dashboard/i });
    expect(dashboardBtn).toBeInTheDocument();

    fireEvent.click(dashboardBtn);
    expect(mockNavigate).toHaveBeenCalledWith("/restaurant/dashboard", { replace: true });

    act(() => {
      jest.runAllTimers();
    });
    jest.useRealTimers();
  });

  it("renders REJECTED state with rejection details and option to edit application", async () => {
    (getRestaurantVerificationStatus as jest.Mock).mockResolvedValue({
      success: true,
      data: {
        status: "REJECTED",
        rejectionReason: "FSSAI certificate expired. Please upload a valid document.",
      },
    });

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText("Verification Unsuccessful")).toBeInTheDocument();
    });

    expect(screen.getByText("Application Rejected")).toBeInTheDocument();
    expect(
      screen.getByText("FSSAI certificate expired. Please upload a valid document."),
    ).toBeInTheDocument();

    const editBtn = screen.getByRole("button", { name: /edit & resubmit application/i });
    fireEvent.click(editBtn);

    expect(mockNavigate).toHaveBeenCalledWith("/restaurant/onboarding/business-information");
  });

  it("refreshes status when Check Status button is clicked", async () => {
    (getRestaurantVerificationStatus as jest.Mock).mockResolvedValue({
      success: true,
      data: { status: "UNDER_REVIEW" },
    });

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText("Application Under Review")).toBeInTheDocument();
    });

    const checkStatusBtn = screen.getByRole("button", { name: /check status/i });
    fireEvent.click(checkStatusBtn);

    expect(getRestaurantVerificationStatus).toHaveBeenCalledTimes(2);
  });
});
