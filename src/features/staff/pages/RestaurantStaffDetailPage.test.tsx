import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { staffDetailService } from "@/features/staff/services/staff-detail.service";
import RestaurantStaffDetailPage from "./RestaurantStaffDetailPage";

jest.mock("@/features/staff/services/staff-detail.service");

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

describe("RestaurantStaffDetailPage", () => {
  let queryClient: QueryClient;

  const mockStaffActive = {
    id: "b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a01",
    restaurantId: "rest_01ABC",
    fullName: "John Owner",
    email: "owner@spotq.com",
    phone: "+1234567890",
    avatarUrl: "https://example.com/avatar.png",
    role: "STAFF",
    status: "ACTIVE",
    createdAt: "2026-09-09T18:58:55.316Z",
    updatedAt: "2026-09-09T18:58:55.316Z",
  };

  const mockStaffInactive = {
    ...mockStaffActive,
    status: "INACTIVE",
  };

  beforeEach(() => {
    jest.clearAllMocks();
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
      },
    });

    useAuthStore.getState().setUser({
      _id: "rest_01ABC",
      restaurantId: "rest_01ABC",
      email: "owner@spotq.com",
      role: "RESTAURANT_ADMIN",
    });
  });

  const renderPage = (
    initialPath = "/restaurant/staff/b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a01",
    routePattern = "/restaurant/staff/:staffId",
  ) => {
    return render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={[initialPath]}>
          <Routes>
            <Route path={routePattern} element={<RestaurantStaffDetailPage />} />
          </Routes>
        </MemoryRouter>
      </QueryClientProvider>,
    );
  };

  it("renders skeleton loading state while fetching staff detail", () => {
    (staffDetailService.getStaffDetail as jest.Mock).mockReturnValue(new Promise(() => {}));

    renderPage();

    expect(screen.getByTestId("staff-detail-skeleton")).toBeInTheDocument();
  });

  it("displays staff details accurately when loaded", async () => {
    (staffDetailService.getStaffDetail as jest.Mock).mockResolvedValue(mockStaffActive);

    renderPage();

    await waitFor(() => {
      expect(screen.getAllByText("John Owner").length).toBeGreaterThan(0);
    });

    // Check email, phone, role, status
    expect(screen.getAllByText("owner@spotq.com").length).toBeGreaterThan(0);
    expect(screen.getByDisplayValue("+1234567890")).toBeInTheDocument();
    expect(screen.getAllByText("STAFF").length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Active/i).length).toBeGreaterThan(0);

    // Identifiers
    expect(screen.getByText("b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a01")).toBeInTheDocument();
    expect(screen.getByText("rest_01ABC")).toBeInTheDocument();

    // Back button
    expect(screen.getByText(/Back to Staff Members/i)).toBeInTheDocument();
  });

  it("displays 'Deactivate Staff' button when status is ACTIVE and toggles UI on click (UI-only)", async () => {
    (staffDetailService.getStaffDetail as jest.Mock).mockResolvedValue(mockStaffActive);

    renderPage();

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /deactivate staff/i })).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole("button", { name: /deactivate staff/i }));

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /activate staff/i })).toBeInTheDocument();
    });
  });

  it("displays 'Activate Staff' button when status is INACTIVE and toggles UI on click (UI-only)", async () => {
    (staffDetailService.getStaffDetail as jest.Mock).mockResolvedValue(mockStaffInactive);

    renderPage();

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /activate staff/i })).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole("button", { name: /activate staff/i }));

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /deactivate staff/i })).toBeInTheDocument();
    });
  });

  it("opens confirmation modal on clicking 'Remove Staff' and handles cancel without action", async () => {
    (staffDetailService.getStaffDetail as jest.Mock).mockResolvedValue(mockStaffActive);

    renderPage();

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /remove staff/i })).toBeInTheDocument();
    });

    // Click remove staff button
    fireEvent.click(screen.getByRole("button", { name: /remove staff/i }));

    // Confirmation dialog should appear
    expect(screen.getByText("Remove Staff Member?")).toBeInTheDocument();
    expect(
      screen.getByText(/Are you sure you want to remove this staff member/i),
    ).toBeInTheDocument();

    // Click Cancel
    const cancelBtn = screen.getByRole("button", { name: /cancel/i });
    fireEvent.click(cancelBtn);

    await waitFor(() => {
      expect(screen.queryByText("Remove Staff Member?")).not.toBeInTheDocument();
    });
  });

  it("confirms remove staff in modal and closes modal (UI-only)", async () => {
    (staffDetailService.getStaffDetail as jest.Mock).mockResolvedValue(mockStaffActive);

    renderPage();

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /remove staff/i })).toBeInTheDocument();
    });

    // Open modal
    fireEvent.click(screen.getByRole("button", { name: /remove staff/i }));

    await waitFor(() => {
      expect(screen.getByText("Remove Staff Member?")).toBeInTheDocument();
    });

    // Find the confirm action button inside the dialog
    const buttons = screen.getAllByRole("button", { name: /remove staff/i });
    const modalConfirmBtn = buttons[buttons.length - 1];
    fireEvent.click(modalConfirmBtn);

    await waitFor(() => {
      expect(screen.queryByText("Remove Staff Member?")).not.toBeInTheDocument();
    });
  });

  it("renders 404 not found state when staff is missing", async () => {
    const notFoundError = new Error("Staff member not found");
    (notFoundError as unknown as { status: number }).status = 404;
    (staffDetailService.getStaffDetail as jest.Mock).mockRejectedValue(notFoundError);

    renderPage("/restaurant/staff/non_existent");

    await waitFor(() => {
      expect(screen.getByText(/staff member not found/i)).toBeInTheDocument();
    });
  });

  it("renders generic error state and retries on clicking Retry", async () => {
    (staffDetailService.getStaffDetail as jest.Mock)
      .mockRejectedValueOnce(new Error("Server error"))
      .mockResolvedValueOnce(mockStaffActive);

    renderPage();

    await waitFor(() => {
      expect(screen.getByText(/unable to load staff details/i)).toBeInTheDocument();
    });

    const retryBtn = screen.getByRole("button", { name: /retry/i });
    fireEvent.click(retryBtn);

    await waitFor(() => {
      expect(screen.getAllByText("John Owner").length).toBeGreaterThan(0);
    });
  });
});
