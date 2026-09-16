import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { StaffDetail } from "@/features/staff/types/staff-detail.types";
import { StaffEditForm } from "./StaffEditForm";

const mockMutate = jest.fn();
jest.mock("@/features/staff/hooks/use-update-staff-info", () => ({
  useUpdateStaffInfo: () => ({
    mutate: mockMutate,
    isPending: false,
  }),
}));

describe("StaffEditForm", () => {
  let queryClient: QueryClient;

  const mockStaff: StaffDetail = {
    id: "stf-123",
    restaurantId: "res-456",
    fullName: "Ravi Kumar",
    email: "ravi@example.com",
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
      defaultOptions: { queries: { retry: false } },
    });
  });

  const renderForm = (props = {}) => {
    return render(
      <QueryClientProvider client={queryClient}>
        <StaffEditForm staff={mockStaff} {...props} />
      </QueryClientProvider>,
    );
  };

  it("renders with populated name and phone, and read-only system details", () => {
    renderForm();

    const nameInput = screen.getByLabelText(/full name/i);
    const phoneInput = screen.getByLabelText(/phone number/i);

    expect(nameInput).toHaveValue("Ravi Kumar");
    expect(phoneInput).toHaveValue("+919876543210");

    expect(screen.getByDisplayValue("ravi@example.com")).toHaveAttribute("readonly");
    expect(screen.getByDisplayValue("Staff")).toHaveAttribute("readonly");
    expect(screen.getByDisplayValue("ACTIVE")).toHaveAttribute("readonly");
    expect(screen.getByDisplayValue("stf-123")).toHaveAttribute("readonly");
    expect(screen.getByDisplayValue("res-456")).toHaveAttribute("readonly");
  });

  it("disables the Update button when form is clean / pristine", () => {
    renderForm();
    const updateButton = screen.getByRole("button", { name: /^update$/i });
    expect(updateButton).toBeDisabled();
  });

  it("calls onCancel and resets form when Cancel button is clicked without calling API", () => {
    const onCancel = jest.fn();
    renderForm({ onCancel });

    const cancelButton = screen.getByRole("button", { name: /cancel/i });
    fireEvent.click(cancelButton);

    expect(onCancel).toHaveBeenCalledTimes(1);
    expect(mockMutate).not.toHaveBeenCalled();
  });

  it("shows validation error when name is empty or whitespace only", async () => {
    const user = userEvent.setup();
    renderForm();

    const nameInput = screen.getByLabelText(/full name/i);
    await user.clear(nameInput);
    await user.type(nameInput, "   ");

    const updateButton = screen.getByRole("button", { name: /^update$/i });
    await user.click(updateButton);

    await waitFor(() => {
      expect(screen.getByText(/name is required/i)).toBeInTheDocument();
    });
    expect(mockMutate).not.toHaveBeenCalled();
  });

  it("shows validation error when phone number format is invalid", async () => {
    const user = userEvent.setup();
    renderForm();

    const phoneInput = screen.getByLabelText(/phone number/i);
    await user.clear(phoneInput);
    await user.type(phoneInput, "12345");

    const updateButton = screen.getByRole("button", { name: /^update$/i });
    await user.click(updateButton);

    await waitFor(() => {
      expect(screen.getByText(/please enter a valid phone number/i)).toBeInTheDocument();
    });
    expect(mockMutate).not.toHaveBeenCalled();
  });

  it("submits trimmed name and normalized phone when form is valid", async () => {
    const user = userEvent.setup();
    renderForm();

    const nameInput = screen.getByLabelText(/full name/i);
    await user.clear(nameInput);
    await user.type(nameInput, "  Anita Sharma  ");

    const updateButton = screen.getByRole("button", { name: /^update$/i });
    expect(updateButton).not.toBeDisabled();

    await user.click(updateButton);

    await waitFor(() => {
      expect(mockMutate).toHaveBeenCalledWith({
        name: "Anita Sharma",
        phone: "+919876543210",
      });
    });
  });
});
