import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import AdminForgotPasswordPage from "./AdminForgotPasswordPage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
    mutations: { retry: false },
  },
});

describe("AdminForgotPasswordPage", () => {
  it("renders branding hero, copy, and recover access form", () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <AdminForgotPasswordPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    // Headline
    expect(
      screen.getByRole("heading", {
        name: /let's get you back on track\./i,
      }),
    ).toBeInTheDocument();

    // Input & Button
    expect(screen.getByLabelText(/identity/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /send verification code/i })).toBeInTheDocument();

    // Back to Sign In link
    const backLink = screen.getByRole("link", { name: /back to sign in/i });
    expect(backLink).toBeInTheDocument();
    expect(backLink).toHaveAttribute("href", "/admin/login");
  });
});
