import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import ForgotPasswordPage from "./ForgotPasswordPage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
    mutations: { retry: false },
  },
});

describe("Customer ForgotPasswordPage", () => {
  it("renders branding hero, forgot password form, email input, and back to login link", () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <ForgotPasswordPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    // Headings
    expect(screen.getByRole("heading", { name: /secure your spotq/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /forgot password\?/i })).toBeInTheDocument();

    // Form elements
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /send reset code/i })).toBeInTheDocument();

    // Back to login link
    const backLink = screen.getByRole("link", { name: /back to login/i });
    expect(backLink).toBeInTheDocument();
    expect(backLink).toHaveAttribute("href", "/login");
  });
});
