import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";

import { useAdminLogin } from "@/features/auth/hooks/useAdminLogin";
import AdminLoginForm from "./AdminLoginForm";

jest.mock("@/features/auth/hooks/useAdminLogin");

const mockUseAdminLogin = useAdminLogin as jest.MockedFunction<typeof useAdminLogin>;

const renderLoginForm = () =>
  render(
    <MemoryRouter>
      <AdminLoginForm />
    </MemoryRouter>,
  );

describe("AdminLoginForm UI & Accessibility Testing", () => {
  const mockMutate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseAdminLogin.mockReturnValue({
      mutate: mockMutate,
      isPending: false,
    } as unknown as ReturnType<typeof useAdminLogin>);
  });

  describe("Rendering & Keyboard Accessibility", () => {
    it("renders all form elements with accessible labels and roles", () => {
      renderLoginForm();

      const emailInput = screen.getByLabelText(/identity/i);
      const passwordInput = screen.getByLabelText(/key/i);
      const submitBtn = screen.getByRole("button", { name: /sign in/i });
      const forgotKeyLink = screen.getByRole("link", { name: /forgot key\?/i });

      expect(emailInput).toBeInTheDocument();
      expect(emailInput).toHaveAttribute("type", "email");
      expect(emailInput).toHaveAttribute("id", "admin-email");

      expect(passwordInput).toBeInTheDocument();
      expect(passwordInput).toHaveAttribute("type", "password");
      expect(passwordInput).toHaveAttribute("id", "admin-password");

      expect(forgotKeyLink).toBeInTheDocument();
      expect(forgotKeyLink).toHaveAttribute("href", "/admin/forgot-password");

      expect(submitBtn).toBeInTheDocument();
      expect(submitBtn).toHaveAttribute("type", "submit");
    });

    it("supports keyboard navigation (Tab through fields and submit via Enter)", async () => {
      const user = userEvent.setup();
      renderLoginForm();

      const emailInput = screen.getByLabelText(/identity/i);
      const passwordInput = screen.getByLabelText(/key/i);
      const submitBtn = screen.getByRole("button", { name: /sign in/i });

      await user.tab();
      expect(emailInput).toHaveFocus();

      await user.type(emailInput, "admin@spotq.com");
      await user.tab();
      await user.tab();
      expect(passwordInput).toHaveFocus();

      await user.type(passwordInput, "securepassword123");
      await user.tab();
      await user.tab();
      expect(submitBtn).toHaveFocus();

      await user.keyboard("{Enter}");
      await waitFor(() => {
        expect(mockMutate).toHaveBeenCalledWith({
          email: "admin@spotq.com",
          password: "securepassword123",
        });
      });
    });
  });

  describe("Validation Testing", () => {
    it("displays validation error when submitting with empty or invalid email", async () => {
      renderLoginForm();

      fireEvent.click(screen.getByRole("button", { name: /sign in/i }));

      await waitFor(() => {
        const emailError = screen.getByText(/please enter a valid email address/i);
        expect(emailError).toBeInTheDocument();
        expect(emailError).toHaveAttribute("role", "alert");
      });

      const emailInput = screen.getByLabelText(/identity/i);
      expect(emailInput).toHaveAttribute("aria-invalid", "true");
      expect(mockMutate).not.toHaveBeenCalled();
    });

    it("displays validation error when password is less than 8 characters", async () => {
      const user = userEvent.setup();
      renderLoginForm();

      const emailInput = screen.getByLabelText(/identity/i);
      const passwordInput = screen.getByLabelText(/key/i);

      await user.type(emailInput, "admin@spotq.com");
      await user.type(passwordInput, "short");

      fireEvent.click(screen.getByRole("button", { name: /sign in/i }));

      await waitFor(() => {
        const passwordError = screen.getByText(/password must be at least 8 characters/i);
        expect(passwordError).toBeInTheDocument();
        expect(passwordError).toHaveAttribute("role", "alert");
      });

      expect(passwordInput).toHaveAttribute("aria-invalid", "true");
      expect(mockMutate).not.toHaveBeenCalled();
    });
  });

  describe("Show / Hide Password Functionality", () => {
    it("toggles password visibility between 'password' and 'text' input types", async () => {
      const user = userEvent.setup();
      renderLoginForm();

      const passwordInput = screen.getByLabelText(/key/i);
      const toggleBtn = screen.getByRole("button", { name: /show password/i });

      expect(passwordInput).toHaveAttribute("type", "password");

      await user.click(toggleBtn);
      expect(passwordInput).toHaveAttribute("type", "text");
      expect(screen.getByRole("button", { name: /hide password/i })).toBeInTheDocument();

      await user.click(screen.getByRole("button", { name: /hide password/i }));
      expect(passwordInput).toHaveAttribute("type", "password");
    });
  });

  describe("Loading State", () => {
    it("disables submit button and displays loading spinner when mutation is pending", () => {
      mockUseAdminLogin.mockReturnValue({
        mutate: mockMutate,
        isPending: true,
      } as unknown as ReturnType<typeof useAdminLogin>);

      renderLoginForm();

      const submitBtn = screen.getByRole("button", { name: /sign in/i });
      expect(submitBtn).toBeDisabled();
      expect(screen.getByText(/signing in…/i)).toBeInTheDocument();
    });
  });
});
