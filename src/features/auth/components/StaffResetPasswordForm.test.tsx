import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";

import { useStaffResetPassword } from "@/features/auth/hooks/useStaffResetPassword";
import StaffResetPasswordForm from "./StaffResetPasswordForm";

jest.mock("@/features/auth/hooks/useStaffResetPassword");

const mockUseStaffResetPassword = useStaffResetPassword as jest.MockedFunction<
  typeof useStaffResetPassword
>;

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <MemoryRouter>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </MemoryRouter>
  );
};

describe("StaffResetPasswordForm", () => {
  const mockMutate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseStaffResetPassword.mockReturnValue({
      mutate: mockMutate,
      isPending: false,
    } as unknown as ReturnType<typeof useStaffResetPassword>);
  });

  it("renders new password and confirm password inputs", () => {
    render(<StaffResetPasswordForm />, { wrapper: createWrapper() });

    expect(screen.getByLabelText(/^new password$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^confirm new password$/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /reset password/i })).toBeInTheDocument();
  });

  it("shows validation error on empty submit", async () => {
    render(<StaffResetPasswordForm />, { wrapper: createWrapper() });

    fireEvent.click(screen.getByRole("button", { name: /reset password/i }));

    await waitFor(() => {
      expect(screen.getByText(/password must be at least 8 characters/i)).toBeInTheDocument();
    });
    expect(mockMutate).not.toHaveBeenCalled();
  });

  it("shows error when passwords do not match", async () => {
    const user = userEvent.setup();
    render(<StaffResetPasswordForm />, { wrapper: createWrapper() });

    await user.type(screen.getByLabelText(/^new password$/i), "ValidPass123!");
    await user.type(screen.getByLabelText(/^confirm new password$/i), "DifferentPass123!");

    fireEvent.click(screen.getByRole("button", { name: /reset password/i }));

    await waitFor(() => {
      expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument();
    });
    expect(mockMutate).not.toHaveBeenCalled();
  });

  it("calls mutate with valid matching password", async () => {
    const user = userEvent.setup();
    render(<StaffResetPasswordForm />, { wrapper: createWrapper() });

    await user.type(screen.getByLabelText(/^new password$/i), "ValidPass123!");
    await user.type(screen.getByLabelText(/^confirm new password$/i), "ValidPass123!");

    fireEvent.click(screen.getByRole("button", { name: /reset password/i }));

    await waitFor(() => {
      expect(mockMutate).toHaveBeenCalledWith({ password: "ValidPass123!" });
    });
  });
});
