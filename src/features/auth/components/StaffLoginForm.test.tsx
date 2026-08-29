import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";

import StaffLoginForm from "./StaffLoginForm";

describe("StaffLoginForm UI Testing", () => {
  const mockOnSubmit = jest.fn();

  const renderComponent = (isLoading = false) =>
    render(
      <MemoryRouter>
        <StaffLoginForm onSubmit={mockOnSubmit} isLoading={isLoading} />
      </MemoryRouter>,
    );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders email, password, forgot password link, and continue button", () => {
    renderComponent();

    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();

    expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument();

    expect(
      screen.getByRole("button", {
        name: /continue/i,
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("link", {
        name: /forgot password\?/i,
      }),
    ).toBeInTheDocument();
  });

  it("submits valid staff credentials", async () => {
    const user = userEvent.setup();

    renderComponent();

    const emailInput = screen.getByPlaceholderText("name@restaurant.com");

    const passwordInput = screen.getByPlaceholderText("••••••••");

    await user.type(emailInput, "staff@restaurant.com");

    await user.type(passwordInput, "StaffPassword123!");

    await user.click(
      screen.getByRole("button", {
        name: /continue/i,
      }),
    );

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledTimes(1);
    });

    expect(mockOnSubmit.mock.calls[0][0]).toEqual({
      email: "staff@restaurant.com",
      password: "StaffPassword123!",
    });
  });

  it("does not submit when email is invalid", async () => {
    const user = userEvent.setup();

    renderComponent();

    const emailInput = screen.getByPlaceholderText("name@restaurant.com");

    const passwordInput = screen.getByPlaceholderText("••••••••");

    await user.type(emailInput, "invalid-email");

    await user.type(passwordInput, "password123");

    await user.click(
      screen.getByRole("button", {
        name: /continue/i,
      }),
    );

    await waitFor(() => {
      expect(screen.getByRole("alert")).toBeInTheDocument();
    });

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it("shows validation errors when fields are empty", async () => {
    const user = userEvent.setup();

    renderComponent();

    await user.click(
      screen.getByRole("button", {
        name: /continue/i,
      }),
    );

    await waitFor(() => {
      expect(screen.getAllByRole("alert").length).toBeGreaterThan(0);
    });

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it("shows loading state when isLoading is true", () => {
    renderComponent(true);

    const submitButton = screen.getByRole("button", {
      name: /signing in/i,
    });

    expect(submitButton).toBeDisabled();
  });

  it("toggles password visibility", async () => {
    const user = userEvent.setup();

    renderComponent();

    const passwordInput = screen.getByLabelText(/^password$/i);

    expect(passwordInput).toHaveAttribute("type", "password");

    const toggleButton = screen.getByRole("button", {
      name: /show password/i,
    });

    await user.click(toggleButton);

    expect(passwordInput).toHaveAttribute("type", "text");

    expect(
      screen.getByRole("button", {
        name: /hide password/i,
      }),
    ).toBeInTheDocument();

    await user.click(
      screen.getByRole("button", {
        name: /hide password/i,
      }),
    );

    expect(passwordInput).toHaveAttribute("type", "password");
  });

  it("contains the staff forgot-password route", () => {
    renderComponent();

    const forgotPasswordLink = screen.getByRole("link", {
      name: /forgot password\?/i,
    });

    expect(forgotPasswordLink).toHaveAttribute("href", "/staff/forgot-password");
  });
});
