import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import type React from "react";
import { apiClient } from "@/lib/api/client";
import { AdminSubscribersPage } from "./AdminSubscribersPage";

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

jest.mock("@/lib/api/client", () => ({
  apiClient: {
    get: jest.fn(),
  },
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

const mockSubscribersResponse = {
  success: true,
  message: "Subscribers retrieved successfully",
  data: {
    subscribers: [
      {
        id: "sub-101",
        restaurantId: "rest-501",
        restaurantName: "Biryani Blues",
        subscriberName: "Karan",
        subscriberEmail: "karan@example.com",
        planName: "Enterprise Annual",
        planCode: "ENT_YEARLY",
        billingCycle: "YEARLY",
        price: 2499900,
        currency: "INR",
        status: "ACTIVE",
        currentPeriodStart: "2026-11-01T00:00:00.000Z",
        currentPeriodEnd: "2027-11-01T00:00:00.000Z",
        createdAt: "2026-11-01T00:00:00.000Z",
      },
    ],
    pagination: {
      currentPage: 1,
      pageSize: 10,
      totalItems: 1,
      totalPages: 1,
      hasNextPage: false,
      hasPreviousPage: false,
    },
  },
};

describe("AdminSubscribersPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render page header, filters, and subscriber table when loaded", async () => {
    (apiClient.get as jest.Mock).mockReturnValue({
      json: jest.fn().mockResolvedValue(mockSubscribersResponse),
    });

    render(<AdminSubscribersPage />, { wrapper: createWrapper() });

    expect(screen.getByTestId("admin-subscribers-page")).toBeInTheDocument();
    expect(screen.getByText("Subscribers")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("Biryani Blues")).toBeInTheDocument();
      expect(screen.getByText("karan@example.com")).toBeInTheDocument();
      expect(screen.getByText("Enterprise Annual")).toBeInTheDocument();
      expect(screen.getByText("Yearly")).toBeInTheDocument();
    });
  });

  it("should navigate to detail page when view details is clicked", async () => {
    (apiClient.get as jest.Mock).mockReturnValue({
      json: jest.fn().mockResolvedValue(mockSubscribersResponse),
    });

    render(<AdminSubscribersPage />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByText("Biryani Blues")).toBeInTheDocument();
    });

    const viewBtn = screen.getByTestId("view-subscriber-btn-sub-101");
    fireEvent.click(viewBtn);

    expect(mockNavigate).toHaveBeenCalledWith("/admin/subscribers/sub-101");
  });

  it("should render error state and allow retrying when API fails", async () => {
    (apiClient.get as jest.Mock).mockReturnValue({
      json: jest.fn().mockRejectedValue(new Error("Network error")),
    });

    render(<AdminSubscribersPage />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByTestId("subscriber-error-state")).toBeInTheDocument();
      expect(screen.getByText("Failed to load subscribers")).toBeInTheDocument();
    });

    const retryBtn = screen.getByTestId("subscriber-list-retry-btn");
    expect(retryBtn).toBeInTheDocument();
  });
});
