import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { profileService } from "../services/profile.service";
import StaffProfilePage from "./StaffProfilePage";

jest.mock("../services/profile.service");

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

describe("StaffProfilePage", () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    jest.clearAllMocks();
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });
    useAuthStore.getState().setUser({
      _id: "staff-1",
      email: "staff@example.com",
      role: "STAFF",
    });
  });

  const renderWithProviders = () => {
    return render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <StaffProfilePage />
        </MemoryRouter>
      </QueryClientProvider>,
    );
  };

  it("AC1: renders skeleton loading state while fetching profile data", () => {
    // Keep promise pending
    (profileService.getStaffProfile as jest.Mock).mockReturnValue(new Promise(() => {}));

    renderWithProviders();

    // Skeletons are rendered with data-slot="skeleton"
    const skeletons = document.querySelectorAll('[data-slot="skeleton"]');
    expect(skeletons.length).toBeGreaterThan(0);
    expect(screen.getByRole("heading", { name: /^staff profile$/i })).toBeInTheDocument();
  });

  it("AC2: displays profile information accurately when API returns success", async () => {
    (profileService.getStaffProfile as jest.Mock).mockResolvedValue({
      id: "staff-1",
      restaurantId: "rest-1",
      fullName: "Julian Montgomery",
      email: "j.montgomery@dineline.com",
      phone: "+1 (555) 234-8901",
      avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb",
      role: "Manager",
      status: "Active",
      createdAt: "2024-10-24T08:42:00.000Z",
    });

    renderWithProviders();

    await waitFor(() => {
      expect(screen.getByDisplayValue("Julian Montgomery")).toBeInTheDocument();
    });

    expect(screen.getByDisplayValue("j.montgomery@dineline.com")).toBeInTheDocument();
    expect(screen.getByDisplayValue("+1 (555) 234-8901")).toBeInTheDocument();
    expect(screen.getByText("Manager")).toBeInTheDocument();
    expect(screen.getByText("Active")).toBeInTheDocument();
    expect(screen.getByText("Personal Details")).toBeInTheDocument();
    expect(screen.getByDisplayValue("October 24, 2024")).toBeInTheDocument();
    expect(screen.getByText(/Staff since October 24, 2024/i)).toBeInTheDocument();
    expect(screen.getByText("staff-1")).toBeInTheDocument();
    expect(screen.getByText("rest-1")).toBeInTheDocument();
    expect(screen.queryByText("Security & Access")).not.toBeInTheDocument();
  });

  it("AC3: renders fallback initials avatar and 'Not provided' placeholder when fields are missing", async () => {
    (profileService.getStaffProfile as jest.Mock).mockResolvedValue({
      id: "staff-2",
      restaurantId: "rest-2",
      fullName: "Alex Johnson",
      email: "alex@dineline.com",
      phone: null,
      avatarUrl: null,
      role: "Staff",
      status: "Active",
      createdAt: "2024-10-24T08:42:00.000Z",
    });

    renderWithProviders();

    await waitFor(() => {
      expect(screen.getByDisplayValue("Alex Johnson")).toBeInTheDocument();
    });

    // Fallback initials for Alex Johnson should be "AJ"
    expect(screen.getByText("AJ")).toBeInTheDocument();

    // Missing phone number displays "Not provided"
    expect(screen.getByDisplayValue("Not provided")).toBeInTheDocument();
  });

  it("AC4: handles 401 Unauthorized by clearing session and redirecting to login page", async () => {
    const unauthorizedError = new Error("401 Unauthorized");
    (unauthorizedError as unknown as { status: number }).status = 401;

    (profileService.getStaffProfile as jest.Mock).mockRejectedValue(unauthorizedError);

    const clearAuthSpy = jest.spyOn(useAuthStore.getState(), "clearAuth");

    renderWithProviders();

    await waitFor(() => {
      expect(clearAuthSpy).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith("/staff/login", { replace: true });
    });
  });

  it("AC4: displays error message with a 'Retry' button when network/500 error occurs", async () => {
    const networkError = new Error(
      "Unable to connect to the server. Please try again in a moment.",
    );
    (profileService.getStaffProfile as jest.Mock).mockRejectedValue(networkError);

    renderWithProviders();

    await waitFor(() => {
      expect(screen.getByRole("alert")).toBeInTheDocument();
    });

    expect(screen.getByText(/Unable to Load Profile/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Unable to connect to the server. Please try again in a moment./i),
    ).toBeInTheDocument();

    // Resolve successfully on retry
    (profileService.getStaffProfile as jest.Mock).mockResolvedValueOnce({
      id: "staff-1",
      restaurantId: "rest-1",
      fullName: "Julian Montgomery",
      email: "j.montgomery@dineline.com",
      phone: "+1 (555) 234-8901",
      avatarUrl: null,
      role: "Manager",
      status: "Active",
      createdAt: "2024-10-24T08:42:00.000Z",
    });

    const retryBtn = screen.getByRole("button", { name: /retry/i });
    fireEvent.click(retryBtn);

    await waitFor(() => {
      expect(screen.getByDisplayValue("Julian Montgomery")).toBeInTheDocument();
    });
  });

  it("navigates to edit profile page when Edit Profile button is clicked", async () => {
    (profileService.getStaffProfile as jest.Mock).mockResolvedValue({
      id: "staff-1",
      restaurantId: "rest-1",
      fullName: "Julian Montgomery",
      email: "j.montgomery@dineline.com",
      phone: "+1 (555) 234-8901",
      avatarUrl: null,
      role: "Manager",
      status: "Active",
      createdAt: null,
    });

    renderWithProviders();

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /edit profile/i })).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole("button", { name: /edit profile/i }));
    expect(mockNavigate).toHaveBeenCalledWith("/staff/profile/edit");
  });

  it("does not render upload photo or change password buttons", async () => {
    (profileService.getStaffProfile as jest.Mock).mockResolvedValue({
      id: "staff-1",
      restaurantId: "rest-1",
      fullName: "Julian Montgomery",
      email: "j.montgomery@dineline.com",
      phone: "+1 (555) 234-8901",
      avatarUrl: null,
      role: "Manager",
      status: "Active",
      createdAt: null,
    });

    renderWithProviders();

    await waitFor(() => {
      expect(screen.getByDisplayValue("Julian Montgomery")).toBeInTheDocument();
    });

    expect(screen.queryByText(/upload new photo/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/change password/i)).not.toBeInTheDocument();
  });
});
