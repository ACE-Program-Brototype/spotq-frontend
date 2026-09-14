import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { restaurantService } from "../services/restaurant.service";
import type { RestaurantDetails } from "../types/restaurant.types";
import { AdminRestaurantDetailsPage } from "./AdminRestaurantDetailsPage";

jest.mock("../services/restaurant.service", () => ({
  restaurantService: {
    getAdminRestaurantById: jest.fn(),
    blockRestaurant: jest.fn(),
    unblockRestaurant: jest.fn(),
  },
}));

const mockRestaurantDetails: RestaurantDetails = {
  id: "a1eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
  restaurant_name: "Metro Bistro",
  category: "Multi-Cuisine",
  email: "contact@metrobistro.com",
  phone: "+15551234567",
  owner_name: "John Doe",
  owner_email: "owner@example.com",
  status: "APPROVED",
  onboarding_status: "COMPLETED",
  is_blocked: false,
  is_subscription_active: true,
  subscription_plan_code: "QUEUE_PRO",
  subscription_ends_at: "2027-01-01T00:00:00.000Z",
  created_at: "2026-09-09T18:58:55.124Z",
  updated_at: "2026-09-11T14:07:51.567Z",
  address: {
    id: "addr-1",
    address_line1: "123 Main Street",
    address_line2: "Suite 400",
    city: "Metropolis",
    state: "New York",
    country: "USA",
    pincode: "10001",
    latitude: 40.7128,
    longitude: -74.006,
  },
  settings: {
    is_opened: true,
    is_preorder: true,
    is_loyalty: false,
    seating_capacity: 20,
  },
  staff: [
    {
      id: "staff-1",
      fullname: "Alice Smith",
      email: "alice@example.com",
      phone: "+15559876543",
      role: "STAFF",
      status: "ACTIVE",
      avatar_url: "https://example.com/avatar1.jpg",
      created_at: "2026-09-09T18:58:55.447Z",
    },
    {
      id: "staff-2",
      fullname: "Bob Johnson",
      email: "bob@example.com",
      phone: "+15559876544",
      role: "STAFF",
      status: "ACTIVE",
      avatar_url: null,
      created_at: "2026-09-09T18:58:55.502Z",
    },
  ],
  documents: [
    {
      id: "doc-1",
      document_type: "FSSAI",
      document_name: "business-license.pdf",
      document_key: "restaurants/a1/documents/license.pdf",
      verification_status: "PENDING",
      uploaded_at: "2026-09-11T14:07:51.870Z",
    },
    {
      id: "doc-2",
      document_type: "GST",
      document_name: "tax-certificate.pdf",
      document_key: "restaurants/a1/documents/tax.pdf",
      verification_status: "APPROVED",
      uploaded_at: "2026-09-11T14:07:51.870Z",
    },
  ],
  images: [
    {
      id: "img-1",
      object_key: "restaurants/a1/images/storefront.jpeg",
      display_order: 1,
      created_at: "2026-09-11T14:07:52.019Z",
    },
  ],
};

function renderWithProviders(
  ui: ReactNode,
  initialEntries = ["/admin/restaurants/a1eebc99-9c0b-4ef8-bb6d-6bb9bd380a11"],
) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={initialEntries}>
        <Routes>
          <Route path="/admin/restaurants/:id" element={ui} />
          <Route path="/admin/restaurants" element={<div>Restaurant List Page</div>} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

describe("AdminRestaurantDetailsPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders loading skeleton while fetching details", () => {
    (restaurantService.getAdminRestaurantById as jest.Mock).mockReturnValue(new Promise(() => {}));

    renderWithProviders(<AdminRestaurantDetailsPage />);

    expect(screen.getByTestId("admin-restaurant-details-loading")).toBeInTheDocument();
  });

  it("renders error state when fetch fails", async () => {
    (restaurantService.getAdminRestaurantById as jest.Mock).mockRejectedValue(
      new Error("Restaurant profile not found"),
    );

    renderWithProviders(<AdminRestaurantDetailsPage />);

    await waitFor(() => {
      expect(screen.getByTestId("admin-restaurant-details-error")).toBeInTheDocument();
    });

    expect(screen.getByText("Restaurant profile not found")).toBeInTheDocument();
  });

  it("renders restaurant details header and overview tab by default", async () => {
    (restaurantService.getAdminRestaurantById as jest.Mock).mockResolvedValue(
      mockRestaurantDetails,
    );

    renderWithProviders(<AdminRestaurantDetailsPage />);

    await waitFor(() => {
      expect(screen.getByTestId("restaurant-details-header")).toBeInTheDocument();
    });

    expect(screen.getByTestId("restaurant-name")).toHaveTextContent("Metro Bistro");
    expect(screen.getByText("Onboarding Complete")).toBeInTheDocument();
    expect(screen.getAllByText("QUEUE_PRO").length).toBeGreaterThanOrEqual(1);

    // Overview Tab Content
    expect(screen.getByTestId("restaurant-overview-tab")).toBeInTheDocument();
    expect(screen.getByText("20 Seats")).toBeInTheDocument();
    expect(screen.getByText("123 Main Street, Suite 400")).toBeInTheDocument();
    expect(screen.getAllByText("John Doe").length).toBeGreaterThanOrEqual(1);
  });

  it("switches tabs to Staff, Documents, and Images correctly", async () => {
    (restaurantService.getAdminRestaurantById as jest.Mock).mockResolvedValue(
      mockRestaurantDetails,
    );

    renderWithProviders(<AdminRestaurantDetailsPage />);

    await waitFor(() => {
      expect(screen.getByTestId("restaurant-name")).toBeInTheDocument();
    });

    // 1. Switch to Staff Tab
    const staffTab = screen.getByTestId("tab-staff");
    fireEvent.click(staffTab);

    await waitFor(() => {
      expect(screen.getByTestId("restaurant-staff-tab")).toBeInTheDocument();
    });
    expect(screen.getByText("Alice Smith")).toBeInTheDocument();
    expect(screen.getByText("Bob Johnson")).toBeInTheDocument();

    // 2. Switch to Documents Tab
    const docsTab = screen.getByTestId("tab-documents");
    fireEvent.click(docsTab);

    await waitFor(() => {
      expect(screen.getByTestId("restaurant-documents-tab")).toBeInTheDocument();
    });
    expect(screen.getByText("business-license.pdf")).toBeInTheDocument();
    expect(screen.getByText("tax-certificate.pdf")).toBeInTheDocument();

    // 3. Switch to Images Tab
    const imagesTab = screen.getByTestId("tab-images");
    fireEvent.click(imagesTab);

    await waitFor(() => {
      expect(screen.getByTestId("restaurant-images-tab")).toBeInTheDocument();
    });
    expect(screen.getByTestId("image-card-img-1")).toBeInTheDocument();
  });

  it("opens block modal when block button is clicked, validates reason, and submits block request", async () => {
    (restaurantService.getAdminRestaurantById as jest.Mock).mockResolvedValue(
      mockRestaurantDetails,
    );
    (restaurantService.blockRestaurant as jest.Mock).mockResolvedValue({
      success: true,
      message: "Restaurant has been blocked successfully.",
      data: { ...mockRestaurantDetails, is_blocked: true, status: "SUSPENDED" },
    });

    renderWithProviders(<AdminRestaurantDetailsPage />);

    await waitFor(() => {
      expect(screen.getByTestId("block-restaurant-btn")).toBeInTheDocument();
    });

    // 1. Click Block Restaurant button
    fireEvent.click(screen.getByTestId("block-restaurant-btn"));

    expect(screen.getByTestId("block-restaurant-modal")).toBeInTheDocument();
    expect(screen.getByText(/reason for blocking/i)).toBeInTheDocument();

    const textarea = screen.getByTestId("block-reason-input");
    const confirmBtn = screen.getByTestId("block-confirm-btn");

    // 2. Submit without text - button disabled or triggers validation
    fireEvent.change(textarea, { target: { value: "abc" } }); // Less than min length 5
    fireEvent.click(confirmBtn);

    await waitFor(() => {
      expect(screen.getByText(/reason must be at least 5 characters long/i)).toBeInTheDocument();
    });

    expect(restaurantService.blockRestaurant).not.toHaveBeenCalled();

    // 3. Enter valid reason and submit
    fireEvent.change(textarea, {
      target: { value: "Repeated food safety violations and expired license." },
    });
    fireEvent.click(confirmBtn);

    await waitFor(() => {
      expect(restaurantService.blockRestaurant).toHaveBeenCalledWith({
        restaurantId: "a1eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
        reason: "Repeated food safety violations and expired license.",
      });
    });
  });

  it("renders unblock button when restaurant is blocked and submits unblock request after confirmation", async () => {
    const blockedRestaurant: RestaurantDetails = {
      ...mockRestaurantDetails,
      is_blocked: true,
      status: "SUSPENDED",
      block_reason: "Violated platform policy",
    };

    (restaurantService.getAdminRestaurantById as jest.Mock).mockResolvedValue(blockedRestaurant);
    (restaurantService.unblockRestaurant as jest.Mock).mockResolvedValue({
      success: true,
      message: "Restaurant has been unblocked successfully.",
      data: { ...blockedRestaurant, is_blocked: false, status: "ACTIVE", block_reason: null },
    });

    renderWithProviders(<AdminRestaurantDetailsPage />);

    await waitFor(() => {
      expect(screen.getByTestId("unblock-restaurant-btn")).toBeInTheDocument();
    });

    expect(screen.getAllByText("SUSPENDED (BLOCKED)")[0]).toBeInTheDocument();
    expect(screen.getByText("Violated platform policy")).toBeInTheDocument();

    // Click Unblock Restaurant button
    fireEvent.click(screen.getByTestId("unblock-restaurant-btn"));

    // Confirm dialog should open
    await waitFor(() => {
      expect(screen.getByRole("alertdialog")).toBeInTheDocument();
    });

    const confirmBtn = screen.getByRole("button", {
      name: /confirm & unblock restaurant/i,
    });
    fireEvent.click(confirmBtn);

    await waitFor(() => {
      expect(restaurantService.unblockRestaurant).toHaveBeenCalledWith({
        restaurantId: "a1eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
      });
    });
  });
});
