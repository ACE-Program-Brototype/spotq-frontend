import { render, screen } from "@testing-library/react";

import AdminLoginPage from "./AdminLoginPage";

jest.mock("@/features/auth/components/LoginForm", () => () => (
  <div data-testid="login-form-mock">Login Form</div>
));

describe("AdminLoginPage Layout & Structure", () => {
  it("renders branding hero headline, quote, logo, and login form section", () => {
    render(<AdminLoginPage />);

    // Brand headline
    expect(
      screen.getByRole("heading", {
        name: /welcome back to the heart of your operations/i,
      }),
    ).toBeInTheDocument();

    // Mission quote description
    expect(screen.getByText(/continue your journey with spotq/i)).toBeInTheDocument();

    // Form section
    expect(screen.getByTestId("login-form-mock")).toBeInTheDocument();
  });

  it("contains accessible landmarks (main, sections)", () => {
    render(<AdminLoginPage />);

    expect(screen.getByRole("main")).toBeInTheDocument();
    expect(screen.getByLabelText(/spotq platform branding/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/admin sign-in form/i)).toBeInTheDocument();
  });
});
