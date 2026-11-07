import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import StaffForgotPasswordPage from "./StaffForgotPasswordPage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
    mutations: { retry: false },
  },
});

describe("StaffForgotPasswordPage", () => {
  it("renders forgot password title, description, email input, and back to login link", () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <StaffForgotPasswordPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    expect(screen.getByRole("heading", { name: /forgot your password\?/i })).toBeInTheDocument();
    expect(
      screen.getByText(
        /enter the email address associated with your account and we'll send you a temporary code/i,
      ),
    ).toBeInTheDocument();

    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /send reset code/i })).toBeInTheDocument();

    const backLink = screen.getByRole("link", { name: /back to login/i });
    expect(backLink).toBeInTheDocument();
    expect(backLink).toHaveAttribute("href", "/staff/login");
  });
});
