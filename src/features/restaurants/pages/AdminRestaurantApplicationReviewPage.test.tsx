import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import type { ReactElement } from "react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { restaurantApplicationService } from "../services/restaurant-application.service";
import { AdminRestaurantApplicationReviewPage } from "./AdminRestaurantApplicationReviewPage";

jest.mock("../services/restaurant-application.service", () => ({
  restaurantApplicationService: {
    getRestaurantApplicationById: jest.fn(),
    approveRestaurantApplication: jest.fn(),
    rejectRestaurantApplication: jest.fn(),
  },
}));

jest.mock("@/services/storage/storage.service", () => ({
  storageService: {
    getPresignedDownloadUrl: jest
      .fn()
      .mockResolvedValue("https://s3.amazonaws.com/spotq-bucket/mock.pdf"),
  },
  getPresignedDownloadUrl: jest
    .fn()
    .mockResolvedValue("https://s3.amazonaws.com/spotq-bucket/mock.pdf"),
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

function renderWithProviders(
  ui: ReactElement,
  initialEntry = "/admin/restaurants/onboarding/app-1",
) {
  const queryClient = createTestQueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[initialEntry]}>
        <Routes>
          <Route path="/admin/restaurants/onboarding/:id" element={ui} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

describe("AdminRestaurantApplicationReviewPage", () => {
  const mockApplication = {
    id: "app-1",
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
        document_key: "restaurants/app-1/documents/fssai.pdf",
        verification_status: "PENDING",
        uploaded_at: "2026-09-09T19:10:00.000Z",
      },
    ],
    images: [
      {
        id: "img-1",
        object_key: "restaurants/app-1/images/facade.jpg",
        display_order: 1,
        created_at: "2026-09-09T19:12:00.000Z",
      },
    ],
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders review details and switches between tabs", async () => {
    (restaurantApplicationService.getRestaurantApplicationById as jest.Mock).mockResolvedValue(
      mockApplication,
    );

    renderWithProviders(<AdminRestaurantApplicationReviewPage />);

    await waitFor(() => {
      expect(screen.getByTestId("application-restaurant-name")).toHaveTextContent(
        "GoodVibes Bistro",
      );
      expect(screen.getByText("123 MG Road")).toBeInTheDocument();
    });

    // Click Documents tab
    const documentsTab = screen.getByTestId("review-tab-documents");
    fireEvent.click(documentsTab);

    await waitFor(() => {
      expect(screen.getByText("fssai_cert.pdf")).toBeInTheDocument();
    });

    // Click Images tab
    const imagesTab = screen.getByTestId("review-tab-images");
    fireEvent.click(imagesTab);

    await waitFor(() => {
      expect(screen.getByText("Submitted Store Photos")).toBeInTheDocument();
    });
  });

  it("approves application through confirmation dialog", async () => {
    (restaurantApplicationService.getRestaurantApplicationById as jest.Mock).mockResolvedValue(
      mockApplication,
    );
    (restaurantApplicationService.approveRestaurantApplication as jest.Mock).mockResolvedValue({
      success: true,
      data: { id: "app-1", status: "APPROVED" },
    });

    renderWithProviders(<AdminRestaurantApplicationReviewPage />);

    await waitFor(() => {
      expect(screen.getByTestId("approve-application-btn")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId("approve-application-btn"));

    // Confirm dialog appears
    await waitFor(() => {
      expect(screen.getByRole("alertdialog")).toBeInTheDocument();
    });

    const confirmBtn = screen.getByRole("button", { name: /confirm & approve/i });
    fireEvent.click(confirmBtn);

    await waitFor(() => {
      expect(restaurantApplicationService.approveRestaurantApplication).toHaveBeenCalledWith(
        "app-1",
      );
    });
  });

  it("rejects application with mandatory reason", async () => {
    (restaurantApplicationService.getRestaurantApplicationById as jest.Mock).mockResolvedValue(
      mockApplication,
    );
    (restaurantApplicationService.rejectRestaurantApplication as jest.Mock).mockResolvedValue({
      success: true,
      data: { id: "app-1", status: "REJECTED" },
    });

    renderWithProviders(<AdminRestaurantApplicationReviewPage />);

    await waitFor(() => {
      expect(screen.getByTestId("reject-application-btn")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId("reject-application-btn"));

    // Reject modal appears
    await waitFor(() => {
      expect(screen.getByTestId("reject-application-modal")).toBeInTheDocument();
    });

    const reasonInput = screen.getByTestId("reject-reason-input");
    const confirmBtn = screen.getByTestId("reject-confirm-btn");

    fireEvent.change(reasonInput, {
      target: { value: "FSSAI certificate is expired and illegible." },
    });
    fireEvent.click(confirmBtn);

    await waitFor(() => {
      expect(restaurantApplicationService.rejectRestaurantApplication).toHaveBeenCalledWith({
        restaurantId: "app-1",
        reason: "FSSAI certificate is expired and illegible.",
      });
    });
  });

  it("removes action buttons when application is already approved", async () => {
    (restaurantApplicationService.getRestaurantApplicationById as jest.Mock).mockResolvedValue({
      ...mockApplication,
      status: "APPROVED",
    });

    renderWithProviders(<AdminRestaurantApplicationReviewPage />);

    await waitFor(() => {
      expect(screen.queryByTestId("application-action-buttons")).not.toBeInTheDocument();
      expect(screen.queryByTestId("approve-application-btn")).not.toBeInTheDocument();
      expect(screen.queryByTestId("reject-application-btn")).not.toBeInTheDocument();
    });
  });

  it("removes action buttons and displays rejection reason when application is rejected", async () => {
    (restaurantApplicationService.getRestaurantApplicationById as jest.Mock).mockResolvedValue({
      ...mockApplication,
      status: "REJECTED",
      rejection_reason: "Invalid FSSAI document",
    });

    renderWithProviders(<AdminRestaurantApplicationReviewPage />);

    await waitFor(() => {
      expect(screen.queryByTestId("application-action-buttons")).not.toBeInTheDocument();
      expect(screen.queryByTestId("approve-application-btn")).not.toBeInTheDocument();
      expect(screen.queryByTestId("reject-application-btn")).not.toBeInTheDocument();
      expect(screen.getByTestId("rejection-reason-banner")).toBeInTheDocument();
      expect(screen.getByTestId("rejection-reason-text")).toHaveTextContent(
        "Invalid FSSAI document",
      );
    });
  });

  it("removes action buttons and displays blocked alert when restaurant is blocked", async () => {
    (restaurantApplicationService.getRestaurantApplicationById as jest.Mock).mockResolvedValue({
      ...mockApplication,
      is_blocked: true,
      block_reason: "Violation of health & safety policies",
    });

    renderWithProviders(<AdminRestaurantApplicationReviewPage />);

    await waitFor(() => {
      expect(screen.queryByTestId("application-action-buttons")).not.toBeInTheDocument();
      expect(screen.queryByTestId("approve-application-btn")).not.toBeInTheDocument();
      expect(screen.queryByTestId("reject-application-btn")).not.toBeInTheDocument();
      expect(screen.getByText("BLOCKED")).toBeInTheDocument();
      expect(screen.getByTestId("block-reason-alert")).toBeInTheDocument();
      expect(screen.getByText("Violation of health & safety policies")).toBeInTheDocument();
    });
  });
});
