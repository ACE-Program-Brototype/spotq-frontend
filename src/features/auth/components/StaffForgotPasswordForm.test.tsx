import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";

import { useStaffForgotPassword } from "@/features/auth/hooks/useStaffForgotPassword";
import StaffForgotPasswordForm from "./StaffForgotPasswordForm";

jest.mock("@/features/auth/hooks/useStaffForgotPassword");

const mockUseStaffForgotPassword = useStaffForgotPassword as jest.MockedFunction<
  typeof useStaffForgotPassword
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

describe("StaffForgotPasswordForm", () => {
  const mockMutate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseStaffForgotPassword.mockReturnValue({
      mutate: mockMutate,
      isPending: false,
    } as unknown as ReturnType<typeof useStaffForgotPassword>);
  });

  it("renders email input and submit button", () => {
    render(<StaffForgotPasswordForm />, { wrapper: createWrapper() });

    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /send reset code/i })).toBeInTheDocument();
  });

  it("shows validation error on empty submit", async () => {
    render(<StaffForgotPasswordForm />, { wrapper: createWrapper() });

    fireEvent.click(screen.getByRole("button", { name: /send reset code/i }));

    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent(/please enter a valid email address/i);
    });
    expect(mockMutate).not.toHaveBeenCalled();
  });

  it("calls mutate with valid email", async () => {
    const user = userEvent.setup();
    render(<StaffForgotPasswordForm />, { wrapper: createWrapper() });

    const emailInput = screen.getByLabelText(/email address/i);
    await user.type(emailInput, "manager@spotq.com");

    fireEvent.click(screen.getByRole("button", { name: /send reset code/i }));

    await waitFor(() => {
      expect(mockMutate).toHaveBeenCalledWith({ email: "manager@spotq.com" });
    });
  });
});
