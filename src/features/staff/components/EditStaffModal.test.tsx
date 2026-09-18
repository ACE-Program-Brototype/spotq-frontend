import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { StaffDetail } from "@/features/staff/types/staff-detail.types";
import { EditStaffModal } from "./EditStaffModal";

const mockMutate = jest.fn();
jest.mock("@/features/staff/hooks/use-update-staff-info", () => ({
  useUpdateStaffInfo: () => ({
    mutate: mockMutate,
    isPending: false,
  }),
}));

describe("EditStaffModal", () => {
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

  const renderModal = (props = {}) => {
    return render(
      <QueryClientProvider client={queryClient}>
        <EditStaffModal isOpen={true} onClose={jest.fn()} staff={mockStaff} {...props} />
      </QueryClientProvider>,
    );
  };

  it("does not render when isOpen is false", () => {
    render(
      <QueryClientProvider client={queryClient}>
        <EditStaffModal isOpen={false} onClose={jest.fn()} staff={mockStaff} />
      </QueryClientProvider>,
    );

    expect(screen.queryByText("Edit Staff Information")).not.toBeInTheDocument();
  });

  it("renders with populated name and phone, and read-only system details", () => {
    renderModal();

    expect(screen.getByText("Edit Staff Information")).toBeInTheDocument();

    const nameInput = screen.getByLabelText(/full name/i);
    const phoneInput = screen.getByLabelText(/phone number/i);

    expect(nameInput).toHaveValue("Ravi Kumar");
    expect(phoneInput).toHaveValue("+919876543210");

    // Read-only fields
    expect(screen.getByDisplayValue("ravi@example.com")).toHaveAttribute("readonly");
    expect(screen.getByDisplayValue("Staff")).toHaveAttribute("readonly");
    expect(screen.getByDisplayValue("ACTIVE")).toHaveAttribute("readonly");
    expect(screen.getByDisplayValue("stf-123")).toHaveAttribute("readonly");
  });

  it("disables the Update button when form has no changes", () => {
    renderModal();
    const updateButton = screen.getByRole("button", { name: /^update$/i });
    expect(updateButton).toBeDisabled();
  });

  it("calls onClose and resets form when Cancel button is clicked without calling API", async () => {
    const onClose = jest.fn();
    renderModal({ onClose });

    const cancelButton = screen.getByRole("button", { name: /cancel/i });
    fireEvent.click(cancelButton);

    expect(onClose).toHaveBeenCalledTimes(1);
    expect(mockMutate).not.toHaveBeenCalled();
  });

  it("shows validation error when name is empty or only whitespace", async () => {
    const user = userEvent.setup();
    renderModal();

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

  it("shows validation error when phone format is invalid", async () => {
    const user = userEvent.setup();
    renderModal();

    const phoneInput = screen.getByLabelText(/phone number/i);
    await user.clear(phoneInput);
    await user.type(phoneInput, "123");

    const updateButton = screen.getByRole("button", { name: /^update$/i });
    await user.click(updateButton);

    await waitFor(() => {
      expect(screen.getByText(/please enter a valid phone number/i)).toBeInTheDocument();
    });
    expect(mockMutate).not.toHaveBeenCalled();
  });

  it("submits only editable fields (name and normalized phone) on valid submission", async () => {
    const user = userEvent.setup();
    renderModal();

    const nameInput = screen.getByLabelText(/full name/i);
    await user.clear(nameInput);
    await user.type(nameInput, "Ravi Sharma");

    const updateButton = screen.getByRole("button", { name: /^update$/i });
    expect(updateButton).not.toBeDisabled();

    await user.click(updateButton);

    await waitFor(() => {
      expect(mockMutate).toHaveBeenCalledWith({
        fullname: "Ravi Sharma",
        phone: "+919876543210",
      });
    });
  });
});
