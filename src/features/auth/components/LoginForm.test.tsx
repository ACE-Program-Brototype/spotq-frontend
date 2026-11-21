import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";

import LoginForm from "./LoginForm";

describe("Customer LoginForm UI Testing", () => {
  const mockOnSubmit = jest.fn();

  const renderComponent = (isLoading = false) =>
    render(
      <MemoryRouter>
        <LoginForm onSubmit={mockOnSubmit} isLoading={isLoading} />
      </MemoryRouter>,
    );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders email, password, and login button", () => {
    renderComponent();

    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /forgot password\?/i })).toBeInTheDocument();
  });

  it("submits valid credentials", async () => {
    renderComponent();

    const emailInput = screen.getByPlaceholderText("e.g. alex@example.com");
    const passwordInput = screen.getByPlaceholderText("••••••••");
    const form = screen.getByRole("button", { name: /login/i }).closest("form");

    if (!form) throw new Error("Form not found");

    await act(async () => {
      fireEvent.change(emailInput, { target: { value: "alex@example.com" } });
      fireEvent.change(passwordInput, { target: { value: "password123" } });
      fireEvent.submit(form);
    });

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        email: "alex@example.com",
        password: "password123",
      });
    });
  });

  it("shows validation error on empty submit", async () => {
    const user = userEvent.setup();
    renderComponent();

    const submitBtn = screen.getByRole("button", { name: /login/i });
    await user.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText(/please enter a valid email address/i)).toBeInTheDocument();
    });
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it("shows loading state when isLoading is true", () => {
    renderComponent(true);

    const submitBtn = screen.getByRole("button", { name: /logging in\.\.\./i });
    expect(submitBtn).toBeDisabled();
    expect(screen.getByText(/logging in\.\.\./i)).toBeInTheDocument();
  });
});
