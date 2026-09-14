import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import type { ReactElement } from "react";
import { MemoryRouter } from "react-router-dom";
import { restaurantApplicationService } from "../services/restaurant-application.service";
import { AdminRestaurantApplicationsPage } from "./AdminRestaurantApplicationsPage";

jest.mock("../services/restaurant-application.service", () => ({
  restaurantApplicationService: {
    getRestaurantApplications: jest.fn(),
  },
}));

function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
    },
  });
}

function renderWithProviders(ui: ReactElement) {
  const queryClient = createTestQueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>{ui}</MemoryRouter>
    </QueryClientProvider>,
  );
}

describe("AdminRestaurantApplicationsPage", () => {
  const mockApplication = {
    id: "app-uuid-1",
    restaurant_name: "GoodVibes Bistro",
    email: "contact@goodvibes.com",
    phone: "+919876543210",
    owner_name: "John Doe",
    owner_email: "owner@goodvibes.com",
    status: "PENDING" as const,
    onboarding_status: "COMPLETED",
    created_at: "2026-09-09T18:58:55.124Z",
    updated_at: "2026-09-14T21:29:24.525Z",
    address: {
      id: "addr-1",
      address_line1: "123 MG Road",
      city: "Kochi",
      state: "Kerala",
      country: "India",
      pincode: "682001",
    },
    documents: [
      {
        id: "doc-1",
        document_type: "FSSAI_LICENSE",
        document_name: "fssai_cert.pdf",
        document_key: "restaurants/app-uuid-1/documents/fssai.pdf",
        verification_status: "PENDING",
        uploaded_at: "2026-09-09T19:10:00.000Z",
      },
    ],
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders page title and applications table", async () => {
    (restaurantApplicationService.getRestaurantApplications as jest.Mock).mockResolvedValue({
      restaurants: [mockApplication],
      pagination: {
        page: 1,
        limit: 10,
        total: 1,
        total_pages: 1,
        has_next_page: false,
        has_prev_page: false,
      },
    });

    renderWithProviders(<AdminRestaurantApplicationsPage />);

    expect(screen.getByText("Restaurant Applications")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("GoodVibes Bistro")).toBeInTheDocument();
      expect(screen.getByText("John Doe")).toBeInTheDocument();
      expect(screen.getAllByText("Pending Verification")[0]).toBeInTheDocument();
      expect(screen.getByText("1 Document")).toBeInTheDocument();
    });
  });

  it("filters by status tab", async () => {
    (restaurantApplicationService.getRestaurantApplications as jest.Mock).mockResolvedValue({
      restaurants: [mockApplication],
      pagination: {
        page: 1,
        limit: 10,
        total: 1,
        total_pages: 1,
        has_next_page: false,
        has_prev_page: false,
      },
    });

    renderWithProviders(<AdminRestaurantApplicationsPage />);

    await waitFor(() => {
      expect(screen.getByText("GoodVibes Bistro")).toBeInTheDocument();
    });

    const pendingTab = screen.getByTestId("status-tab-pending");
    fireEvent.click(pendingTab);

    await waitFor(() => {
      expect(restaurantApplicationService.getRestaurantApplications).toHaveBeenCalledWith(
        expect.objectContaining({
          status: "PENDING",
        }),
      );
    });
  });

  it("renders error state on API failure and allows retry", async () => {
    (restaurantApplicationService.getRestaurantApplications as jest.Mock).mockRejectedValueOnce(
      new Error("Network Error"),
    );

    renderWithProviders(<AdminRestaurantApplicationsPage />);

    await waitFor(() => {
      expect(screen.getByTestId("application-error-state")).toBeInTheDocument();
    });

    (restaurantApplicationService.getRestaurantApplications as jest.Mock).mockResolvedValue({
      restaurants: [mockApplication],
      pagination: {
        page: 1,
        limit: 10,
        total: 1,
        total_pages: 1,
        has_next_page: false,
        has_prev_page: false,
      },
    });

    const retryBtn = screen.getByRole("button", { name: /retry/i });
    fireEvent.click(retryBtn);

    await waitFor(() => {
      expect(screen.getByText("GoodVibes Bistro")).toBeInTheDocument();
    });
  });
});
