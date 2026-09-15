import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { toast } from "sonner";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { profileService } from "../services/profile.service";
import EditStaffProfilePage from "./EditStaffProfilePage";

jest.mock("../services/profile.service");
jest.mock("sonner", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

describe("EditStaffProfilePage (SCRUM-689)", () => {
  let queryClient: QueryClient;

  const mockStaffProfile = {
    id: "stf_02AB",
    restaurantId: "res_01ABC",
    fullName: "Ravi Kumar",
    email: "ravi.kumar@restaurant.com",
    phone: "+91 98765 43210",
    avatarUrl: "https://example.com/avatar.jpg",
    role: "Staff",
    status: "Active",
    createdAt: "2024-10-24T08:42:00.000Z",
  };

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
      _id: "stf_02AB",
      id: "stf_02AB",
      name: "Ravi Kumar",
      email: "ravi.kumar@restaurant.com",
      role: "RESTAURANT_STAFF",
    });
  });

  const renderWithProviders = () => {
    return render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <EditStaffProfilePage />
        </MemoryRouter>
      </QueryClientProvider>,
    );
  };

  it("AC1 & AC9: renders loading skeleton before profile data is resolved", () => {
    (profileService.getStaffProfile as jest.Mock).mockReturnValue(new Promise(() => {}));

    renderWithProviders();

    const skeletons = document.querySelectorAll('[data-slot="skeleton"]');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it("AC2, AC3, AC4: populates existing details and verifies read-only fields", async () => {
    (profileService.getStaffProfile as jest.Mock).mockResolvedValue(mockStaffProfile);

    renderWithProviders();

    await waitFor(() => {
      expect(screen.getByLabelText(/full name/i)).toHaveValue("Ravi Kumar");
    });

    expect(screen.getByLabelText(/phone number/i)).toHaveValue("+91 98765 43210");

    // Email must be read-only
    const emailInput = screen.getByLabelText(/email address/i);
    expect(emailInput).toHaveValue("ravi.kumar@restaurant.com");
    expect(emailInput).toHaveAttribute("readonly");

    // Role, status, IDs must not be editable inputs
    expect(screen.getByText("Staff")).toBeInTheDocument();
    expect(screen.getByText("Active")).toBeInTheDocument();
    expect(screen.getByText("stf_02AB")).toBeInTheDocument();
    expect(screen.getByText("res_01ABC")).toBeInTheDocument();

    // Sensitive security elements like passwords, hashes or OTPs must never be exposed
    expect(screen.queryByLabelText(/password hash/i)).not.toBeInTheDocument();
    expect(screen.queryByLabelText(/access token/i)).not.toBeInTheDocument();
    expect(screen.queryByLabelText(/refresh token/i)).not.toBeInTheDocument();
  });

  it("AC2: validates that name cannot be empty or whitespace-only", async () => {
    const user = userEvent.setup();
    (profileService.getStaffProfile as jest.Mock).mockResolvedValue(mockStaffProfile);

    renderWithProviders();

    await waitFor(() => {
      expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
    });

    const nameInput = screen.getByLabelText(/full name/i);
    await user.clear(nameInput);
    await user.type(nameInput, "   ");

    await waitFor(() => {
      expect(screen.getByText(/name is required/i)).toBeInTheDocument();
    });

    // Save Changes button should be disabled
    const saveBtn = screen.getByRole("button", { name: /save changes/i });
    expect(saveBtn).toBeDisabled();
  });

  it("AC3: validates phone number format", async () => {
    const user = userEvent.setup();
    (profileService.getStaffProfile as jest.Mock).mockResolvedValue(mockStaffProfile);

    renderWithProviders();

    await waitFor(() => {
      expect(screen.getByLabelText(/phone number/i)).toBeInTheDocument();
    });

    const phoneInput = screen.getByLabelText(/phone number/i);
    await user.clear(phoneInput);
    await user.type(phoneInput, "12345");

    await waitFor(() => {
      expect(screen.getByText(/please enter a valid phone number/i)).toBeInTheDocument();
    });

    const saveBtn = screen.getByRole("button", { name: /save changes/i });
    expect(saveBtn).toBeDisabled();
  });

  it("disables Save Changes button when form has no changes", async () => {
    (profileService.getStaffProfile as jest.Mock).mockResolvedValue(mockStaffProfile);

    renderWithProviders();

    await waitFor(() => {
      expect(screen.getByLabelText(/full name/i)).toHaveValue("Ravi Kumar");
    });

    const saveBtn = screen.getByRole("button", { name: /save changes/i });
    expect(saveBtn).toBeDisabled();
  });

  it("AC5: submits updated fields, displays success notification and navigates", async () => {
    const user = userEvent.setup();
    (profileService.getStaffProfile as jest.Mock).mockResolvedValue(mockStaffProfile);
    (profileService.updateStaffProfile as jest.Mock).mockResolvedValue({
      ...mockStaffProfile,
      fullName: "Ravi K. Sharma",
      phone: "+919876543210",
    });

    renderWithProviders();

    await waitFor(() => {
      expect(screen.getByLabelText(/full name/i)).toHaveValue("Ravi Kumar");
    });

    const nameInput = screen.getByLabelText(/full name/i);
    await user.clear(nameInput);
    await user.type(nameInput, "Ravi K. Sharma");

    const saveBtn = screen.getByRole("button", { name: /save changes/i });
    expect(saveBtn).not.toBeDisabled();

    await user.click(saveBtn);

    await waitFor(() => {
      expect(profileService.updateStaffProfile).toHaveBeenCalledWith("res_01ABC", "stf_02AB", {
        name: "Ravi K. Sharma",
        phone: "+919876543210",
      });
      expect(toast.success).toHaveBeenCalledWith("Staff profile updated successfully.");
      expect(mockNavigate).toHaveBeenCalledWith("/staff/profile");
    });
  });

  it("AC6: Cancel button discards changes and returns to profile page without calling API", async () => {
    const user = userEvent.setup();
    (profileService.getStaffProfile as jest.Mock).mockResolvedValue(mockStaffProfile);

    renderWithProviders();

    await waitFor(() => {
      expect(screen.getByLabelText(/full name/i)).toHaveValue("Ravi Kumar");
    });

    const nameInput = screen.getByLabelText(/full name/i);
    await user.clear(nameInput);
    await user.type(nameInput, "Unsaved Change");

    const cancelBtn = screen.getByRole("button", { name: /^cancel$/i });
    await user.click(cancelBtn);

    expect(profileService.updateStaffProfile).not.toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith("/staff/profile");
  });

  it("AC7: handles 403 Forbidden error response", async () => {
    const user = userEvent.setup();
    (profileService.getStaffProfile as jest.Mock).mockResolvedValue(mockStaffProfile);

    const forbiddenError = new Error("Forbidden");
    (forbiddenError as unknown as { status: number }).status = 403;
    (profileService.updateStaffProfile as jest.Mock).mockRejectedValue(forbiddenError);

    renderWithProviders();

    await waitFor(() => {
      expect(screen.getByLabelText(/full name/i)).toHaveValue("Ravi Kumar");
    });

    const nameInput = screen.getByLabelText(/full name/i);
    await user.clear(nameInput);
    await user.type(nameInput, "Ravi K.");

    const saveBtn = screen.getByRole("button", { name: /save changes/i });
    await user.click(saveBtn);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        "You do not have permission to update this profile.",
      );
    });
  });

  it("AC7: handles 404 Not Found error response", async () => {
    const user = userEvent.setup();
    (profileService.getStaffProfile as jest.Mock).mockResolvedValue(mockStaffProfile);

    const notFoundError = new Error("Not Found");
    (notFoundError as unknown as { status: number }).status = 404;
    (profileService.updateStaffProfile as jest.Mock).mockRejectedValue(notFoundError);

    renderWithProviders();

    await waitFor(() => {
      expect(screen.getByLabelText(/full name/i)).toHaveValue("Ravi Kumar");
    });

    const nameInput = screen.getByLabelText(/full name/i);
    await user.clear(nameInput);
    await user.type(nameInput, "Ravi K.");

    const saveBtn = screen.getByRole("button", { name: /save changes/i });
    await user.click(saveBtn);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Staff member not found.");
    });
  });

  it("handles avatar file selection and updates avatarUrl when submitted", async () => {
    const user = userEvent.setup();
    (profileService.getStaffProfile as jest.Mock).mockResolvedValue(mockStaffProfile);
    (profileService.uploadStaffAvatar as jest.Mock).mockResolvedValue(
      "restaurants/res_01ABC/profile/new_avatar.jpg",
    );
    (profileService.updateStaffProfile as jest.Mock).mockResolvedValue({
      ...mockStaffProfile,
      avatarUrl: "restaurants/res_01ABC/profile/new_avatar.jpg",
    });

    renderWithProviders();

    await waitFor(() => {
      expect(screen.getByLabelText(/full name/i)).toHaveValue("Ravi Kumar");
    });

    const fileInput = screen.getByLabelText(/upload profile photo/i);
    const validFile = new File(["dummy"], "photo.png", { type: "image/png" });

    // Mock createObjectURL
    window.URL.createObjectURL = jest.fn().mockReturnValue("blob:http://localhost/new-avatar");

    await user.upload(fileInput, validFile);

    const saveBtn = screen.getByRole("button", { name: /save changes/i });
    expect(saveBtn).not.toBeDisabled();

    await user.click(saveBtn);

    await waitFor(() => {
      expect(profileService.uploadStaffAvatar).toHaveBeenCalledWith("res_01ABC", validFile);
      expect(profileService.updateStaffProfile).toHaveBeenCalledWith(
        "res_01ABC",
        "stf_02AB",
        expect.objectContaining({
          avatarUrl: "restaurants/res_01ABC/profile/new_avatar.jpg",
        }),
      );
    });
  });
});
