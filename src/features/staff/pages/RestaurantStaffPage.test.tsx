import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import type React from "react";
import { MemoryRouter } from "react-router-dom";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { staffMemberService } from "@/features/staff/services/staff-member.service";
import RestaurantStaffPage from "./RestaurantStaffPage";

jest.mock("@/features/staff/services/staff-member.service");
jest.mock("@/features/staff/services/staff-invitation.service", () => ({
  staffInvitationService: {
    getInvitations: jest.fn().mockResolvedValue({
      success: true,
      data: { invitations: [], pagination: { total: 0 } },
    }),
    sendInvitation: jest.fn().mockResolvedValue({ success: true }),
  },
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>{children}</MemoryRouter>
    </QueryClientProvider>
  );
};

describe("RestaurantStaffPage", () => {
  const mockGetStaffMembers = staffMemberService.getStaffMembers as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    useAuthStore.setState({
      user: {
        id: "owner-1",
        email: "owner@spotq.com",
        fullName: "Owner User",
        role: "RESTAURANT_ADMIN",
        restaurantId: "rest-123",
      },
      accessToken: "mock-token",
      isAuthenticated: true,
    });
  });

  it("renders page header and stats cards correctly", async () => {
    mockGetStaffMembers.mockResolvedValueOnce({
      success: true,
      data: [
        {
          id: "staff-1",
          name: "Ravi Kumar",
          email: "ravi@example.com",
          phone: "9876543211",
          designation: "Manager",
          status: "ACTIVE",
          joinedDate: "2026-01-02",
          lastLogin: "2026-01-02",
          employeeCode: "EMP-001",
        },
      ],
      pagination: { page: 1, limit: 20, total: 1, totalPages: 1 },
    });

    const Wrapper = createWrapper();
    render(<RestaurantStaffPage />, { wrapper: Wrapper });

    expect(screen.getByRole("heading", { name: "Restaurant Staff" })).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("Ravi Kumar")).toBeInTheDocument();
    });

    expect(screen.getByText("ravi@example.com")).toBeInTheDocument();
    expect(screen.getAllByText("Manager")[0]).toBeInTheDocument();
    expect(screen.getAllByText("Active")[0]).toBeInTheDocument();
  });

  it("triggers sort toggle when Member or Joined Date headers are clicked", async () => {
    mockGetStaffMembers.mockResolvedValue({
      success: true,
      data: [
        {
          id: "staff-1",
          name: "Ravi Kumar",
          email: "ravi@example.com",
          phone: "9876543211",
          designation: "Manager",
          status: "ACTIVE",
          joinedDate: "2026-01-02",
          lastLogin: "2026-01-02",
          employeeCode: "EMP-001",
        },
      ],
      pagination: { page: 1, limit: 20, total: 1, totalPages: 1 },
    });

    const Wrapper = createWrapper();
    render(<RestaurantStaffPage />, { wrapper: Wrapper });

    await waitFor(() => {
      expect(screen.getByText("Ravi Kumar")).toBeInTheDocument();
    });

    const joinedDateSortBtn = screen.getByRole("button", { name: /Joined Date/i });
    fireEvent.click(joinedDateSortBtn);

    await waitFor(() => {
      expect(mockGetStaffMembers).toHaveBeenCalledWith(
        "rest-123",
        expect.objectContaining({
          sortBy: "createdAt",
          sortOrder: "ASC",
        }),
      );
    });
  });

  it("shows empty state when no staff members are returned", async () => {
    mockGetStaffMembers.mockResolvedValueOnce({
      success: true,
      data: [],
      pagination: { page: 1, limit: 20, total: 0, totalPages: 0 },
    });

    const Wrapper = createWrapper();
    render(<RestaurantStaffPage />, { wrapper: Wrapper });

    await waitFor(() => {
      expect(screen.getByText("No staff members found")).toBeInTheDocument();
    });

    expect(screen.getByRole("button", { name: /Invite First Staff Member/i })).toBeInTheDocument();
  });

  it("opens invite staff modal when Invite Staff button is clicked", async () => {
    mockGetStaffMembers.mockResolvedValueOnce({
      success: true,
      data: [],
      pagination: { page: 1, limit: 20, total: 0, totalPages: 0 },
    });

    const Wrapper = createWrapper();
    render(<RestaurantStaffPage />, { wrapper: Wrapper });

    await waitFor(() => {
      expect(screen.getByText("No staff members found")).toBeInTheDocument();
    });

    const inviteButtons = screen.getAllByRole("button", { name: /Invite Staff/i });
    fireEvent.click(inviteButtons[0]);

    await waitFor(() => {
      expect(screen.getByText("Invite Staff Member")).toBeInTheDocument();
    });
  });
});
