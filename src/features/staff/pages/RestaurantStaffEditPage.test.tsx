import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { staffDetailService } from "@/features/staff/services/staff-detail.service";
import RestaurantStaffEditPage from "./RestaurantStaffEditPage";

jest.mock("@/features/staff/services/staff-detail.service");

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

describe("RestaurantStaffEditPage", () => {
  let queryClient: QueryClient;

  const mockStaff = {
    id: "b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a01",
    restaurantId: "rest_01ABC",
    fullName: "Ravi Kumar",
    email: "ravi@spotq.com",
    phone: "+919876543210",
    avatarUrl: null,
    role: "Staff",
    status: "ACTIVE",
    createdAt: "2026-09-09T18:58:55.316Z",
    updatedAt: "2026-09-09T18:58:55.316Z",
  };

  beforeEach(() => {
    jest.clearAllMocks();
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });

    useAuthStore.getState().setUser({
      _id: "rest_01ABC",
      restaurantId: "rest_01ABC",
      email: "owner@spotq.com",
      role: "RESTAURANT_ADMIN",
    });
  });

  const renderEditPage = (
    initialPath = "/restaurant/staff/b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a01/edit",
  ) => {
    return render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={[initialPath]}>
          <Routes>
            <Route path="/restaurant/staff/:staffId/edit" element={<RestaurantStaffEditPage />} />
          </Routes>
        </MemoryRouter>
      </QueryClientProvider>,
    );
  };

  it("renders loading skeleton while loading staff details", () => {
    (staffDetailService.getStaffDetail as jest.Mock).mockReturnValue(new Promise(() => {}));

    renderEditPage();

    expect(screen.getByTestId("staff-detail-skeleton")).toBeInTheDocument();
  });

  it("renders populated form and read-only details when loaded", async () => {
    (staffDetailService.getStaffDetail as jest.Mock).mockResolvedValue(mockStaff);

    renderEditPage();

    await waitFor(() => {
      expect(screen.getByDisplayValue("Ravi Kumar")).toBeInTheDocument();
    });

    expect(screen.getByDisplayValue("+919876543210")).toBeInTheDocument();
    expect(screen.getByDisplayValue("ravi@spotq.com")).toHaveAttribute("readonly");
    expect(screen.getByDisplayValue("Staff")).toHaveAttribute("readonly");
    expect(screen.getByDisplayValue("ACTIVE")).toHaveAttribute("readonly");
  });

  it("disables the Update button when form has no changes", async () => {
    (staffDetailService.getStaffDetail as jest.Mock).mockResolvedValue(mockStaff);

    renderEditPage();

    await waitFor(() => {
      expect(screen.getByDisplayValue("Ravi Kumar")).toBeInTheDocument();
    });

    const updateBtn = screen.getByRole("button", { name: /^update$/i });
    expect(updateBtn).toBeDisabled();
  });

  it("navigates back to staff details when cancel button is clicked", async () => {
    (staffDetailService.getStaffDetail as jest.Mock).mockResolvedValue(mockStaff);

    renderEditPage();

    await waitFor(() => {
      expect(screen.getByDisplayValue("Ravi Kumar")).toBeInTheDocument();
    });

    const cancelBtn = screen.getByRole("button", { name: /^cancel$/i });
    fireEvent.click(cancelBtn);

    expect(mockNavigate).toHaveBeenCalledWith(
      "/restaurant/staff/b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a01",
    );
  });

  it("submits update with modified data and navigates back on success", async () => {
    const user = userEvent.setup();
    (staffDetailService.getStaffDetail as jest.Mock).mockResolvedValue(mockStaff);
    (staffDetailService.updateStaffInfo as jest.Mock).mockResolvedValue({
      ...mockStaff,
      fullName: "Ravi Sharma",
    });

    renderEditPage();

    await waitFor(() => {
      expect(screen.getByDisplayValue("Ravi Kumar")).toBeInTheDocument();
    });

    const nameInput = screen.getByLabelText(/full name/i);
    await user.clear(nameInput);
    await user.type(nameInput, "Ravi Sharma");

    const updateBtn = screen.getByRole("button", { name: /^update$/i });
    expect(updateBtn).not.toBeDisabled();

    await user.click(updateBtn);

    await waitFor(() => {
      expect(staffDetailService.updateStaffInfo).toHaveBeenCalledWith(
        "rest_01ABC",
        "b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a01",
        {
          fullname: "Ravi Sharma",
          phone: "+919876543210",
        },
      );
      expect(mockNavigate).toHaveBeenCalledWith(
        "/restaurant/staff/b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a01",
      );
    });
  });
});
