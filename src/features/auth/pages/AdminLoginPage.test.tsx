import { render, screen } from "@testing-library/react";

import AdminLoginPage from "./AdminLoginPage";

jest.mock("@/features/auth/components/AdminLoginForm", () => () => (
  <div data-testid="login-form-mock">Login Form</div>
));

describe("AdminLoginPage Layout & Structure", () => {
  it("renders branding hero headline, quote, logo, and login form section", () => {
    render(<AdminLoginPage />);

    expect(
      screen.getByRole("heading", {
        name: /welcome back to the heart of your operations/i,
      }),
    ).toBeInTheDocument();

    expect(screen.getByText(/continue your journey with spotq/i)).toBeInTheDocument();

    expect(screen.getByTestId("login-form-mock")).toBeInTheDocument();
  });

  it("contains accessible landmarks (main, sections)", () => {
    render(<AdminLoginPage />);

    expect(screen.getByRole("main")).toBeInTheDocument();
    expect(screen.getByLabelText(/spotq platform branding/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/admin sign-in form/i)).toBeInTheDocument();
  });
});
