import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import ForgotPasswordPage from "./ForgotPasswordPage";

describe("ForgotPasswordPage", () => {
  it("renders branding hero, key recovery heading, coming soon badge, and back link", () => {
    render(
      <MemoryRouter>
        <ForgotPasswordPage />
      </MemoryRouter>,
    );

    // Hero branding
    expect(
      screen.getByRole("heading", {
        name: /secure administrative key recovery/i,
      }),
    ).toBeInTheDocument();

    // Recovery content & badge
    expect(screen.getByRole("heading", { name: /^key recovery$/i })).toBeInTheDocument();
    expect(screen.getByText(/coming soon/i)).toBeInTheDocument();
    expect(
      screen.getByText(/self-service administrative key reset is currently in development/i),
    ).toBeInTheDocument();

    // Back to Sign In link
    const backLink = screen.getByRole("link", { name: /back to sign in/i });
    expect(backLink).toBeInTheDocument();
    expect(backLink).toHaveAttribute("href", "/admin/login");
  });

  it("contains accessible landmarks", () => {
    render(
      <MemoryRouter>
        <ForgotPasswordPage />
      </MemoryRouter>,
    );

    expect(screen.getByRole("main")).toBeInTheDocument();
    expect(screen.getByLabelText(/spotq platform branding/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/key recovery coming soon/i)).toBeInTheDocument();
  });
});
